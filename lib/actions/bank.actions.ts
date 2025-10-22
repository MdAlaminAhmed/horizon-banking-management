"use server";

import {
  ACHClass,
  CountryCode,
  TransferAuthorizationCreateRequest,
  TransferCreateRequest,
  TransferNetwork,
  TransferType,
} from "plaid";

import { plaidClient } from "../plaid";
import { parseStringify } from "../utils";

import { getTransactionsByBankId } from "./transaction.actions";
import { getBanks, getBank } from "./user.actions";

// Get multiple bank accounts
export const getAccounts = async ({ userId }: getAccountsProps) => {
  try {
    // get banks from db
    const banks = await getBanks({ userId });

    // ⚡ OPTIMIZATION: Fetch all account data in parallel
    const accountsPromises = banks?.map(async (bank: Bank) => {
      try {
        // get each account info from plaid
        const accountsResponse = await plaidClient.accountsGet({
          access_token: bank.accessToken,
        });
        const accountData = accountsResponse.data.accounts[0];

        // get institution info from plaid
        const institution = await getInstitution({
          institutionId: accountsResponse.data.item.institution_id!,
        });

        return {
          id: accountData.account_id,
          availableBalance: accountData.balances.available!,
          currentBalance: accountData.balances.current!,
          institutionId: institution.institution_id,
          name: accountData.name,
          officialName: accountData.official_name,
          mask: accountData.mask!,
          type: accountData.type as string,
          subtype: accountData.subtype! as string,
          appwriteItemId: bank.$id,
          shareableId: bank.shareableId,
        };
      } catch (err) {
        // If one account fails, don't fail all - return partial data
        console.warn('Failed to fetch account data for bank:', bank.$id, err);
        return null;
      }
    }) || [];

    const accounts = (await Promise.all(accountsPromises)).filter(Boolean);

    const totalBanks = accounts.length;
    const totalCurrentBalance = accounts.reduce((total, account) => {
      return total + account.currentBalance;
    }, 0);

    return parseStringify({ data: accounts, totalBanks, totalCurrentBalance });
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
    return parseStringify({ data: [], totalBanks: 0, totalCurrentBalance: 0 });
  }
};

// Get one bank account
export const getAccount = async ({ appwriteItemId }: getAccountProps) => {
  try {
    // get bank from db
    const bank = await getBank({ documentId: appwriteItemId });

    console.log(`🔍 Fetching account data for bank ID: ${bank.$id}, User ID: ${bank.userId}`);

    // ⚡ OPTIMIZATION: Fetch account data and transactions in parallel with timeout
    const accountPromise = plaidClient.accountsGet({
      access_token: bank.accessToken,
    }).catch(err => {
      console.warn('Failed to fetch account info:', err);
      return null;
    });

    const transferTransactionsPromise = getTransactionsByBankId({
      bankId: bank.$id,
    }).catch(err => {
      console.warn('Failed to fetch transfer transactions:', err);
      return { documents: [] };
    });

    const [accountsResponse, transferTransactionsData] = await Promise.all([
      accountPromise,
      transferTransactionsPromise
    ]);

    if (!accountsResponse) {
      throw new Error('Failed to fetch account data');
    }

    const accountData = accountsResponse.data.accounts[0];

    const transferTransactions = transferTransactionsData.documents.map(
      (transferData: Transaction) => ({
        id: transferData.$id,
        name: transferData.name!,
        amount: transferData.senderBankId === bank.$id
          ? -Math.abs(parseFloat(transferData.amount!.toString()))  // Debit: negative amount
          : Math.abs(parseFloat(transferData.amount!.toString())),  // Credit: positive amount
        date: transferData.$createdAt,
        paymentChannel: transferData.channel,
        category: transferData.category,
        type: transferData.senderBankId === bank.$id ? "debit" : "credit",
      })
    );

    console.log(`📊 Transfer transactions for bank ${bank.$id}:`, {
      total: transferTransactionsData.documents.length,
      transactions: transferTransactions.map((t: any) => ({ name: t.name, amount: t.amount, type: t.type }))
    });

    // get institution info from plaid
    const institution = await getInstitution({
      institutionId: accountsResponse.data.item.institution_id!,
    });

    let transactions: any[] = [];
    try {
      const t = await getTransactions({
        accessToken: bank?.accessToken,
      });
      transactions = Array.isArray(t) ? t : [];
    } catch (err: any) {
      // If transactions scope wasn't granted (e.g., ADDITIONAL_CONSENT_REQUIRED), continue without them
      console.warn('Skipping Plaid transactions fetch:', err?.response?.data || err?.message || err);
      transactions = [];
    }

    const account = {
      id: accountData.account_id,
      availableBalance: accountData.balances.available!,
      currentBalance: accountData.balances.current!,
      institutionId: institution.institution_id,
      name: accountData.name,
      officialName: accountData.official_name,
      mask: accountData.mask!,
      type: accountData.type as string,
      subtype: accountData.subtype! as string,
      appwriteItemId: bank.$id,
    };

    // sort transactions by date such that the most recent transaction is first
    const allTransactions = [...(transactions || []), ...(transferTransactions || [])].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return parseStringify({
      data: account,
      transactions: allTransactions,
    });
  } catch (error) {
    console.error("An error occurred while getting the account:", error);
  }
};

// Get bank info
export const getInstitution = async ({
  institutionId,
}: getInstitutionProps) => {
  try {
    const institutionResponse = await plaidClient.institutionsGetById({
      institution_id: institutionId,
      country_codes: ["US"] as CountryCode[],
    });

    const intitution = institutionResponse.data.institution;

    return parseStringify(intitution);
  } catch (error) {
    console.error("An error occurred while getting the accounts:", error);
  }
};

// Get transactions
export const getTransactions = async ({
  accessToken,
}: getTransactionsProps) => {
  let hasMore = true;
  let transactions: any[] = [];
  let cursor: string | undefined = undefined;

  try {
    // Iterate through each page of new transaction updates for item
    while (hasMore) {
      const response = await plaidClient.transactionsSync({
        access_token: accessToken,
        cursor,
      });

      const data = response.data;

      transactions = transactions.concat(
        response.data.added.map((transaction) => ({
          id: transaction.transaction_id,
          name: transaction.name,
          paymentChannel: transaction.payment_channel,
          type: transaction.payment_channel,
          accountId: transaction.account_id,
          amount: transaction.amount,
          pending: transaction.pending,
          category: transaction.category ? transaction.category[0] : "",
          date: transaction.date,
          image: transaction.logo_url,
        }))
      );

      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    return parseStringify(transactions);
  } catch (error) {
    // If the client didn't consent to transactions, bubble up so caller can handle
    console.error("An error occurred while getting the accounts:", (error as any)?.response?.data || error);
    throw error;
  }
};