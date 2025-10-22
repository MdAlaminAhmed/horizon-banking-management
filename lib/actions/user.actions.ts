'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";

import { plaidClient } from '@/lib/plaid';
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId }) 

    return parseStringify(user);
  } catch (error) {
    console.error('Error', error);
  }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;
  
  let newUserAccount;

  try {
    const { account, database } = await createAdminClient();

    console.log('📝 Creating Appwrite user account...');
    newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if(!newUserAccount) throw new Error('Error creating user')
    console.log('✅ Appwrite user created:', newUserAccount.$id);

    try {
      console.log('📝 Creating Dwolla customer with data:', {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        type: 'personal',
        address1: userData.address1,
        city: userData.city,
        state: userData.state,
        postalCode: userData.postalCode,
        dateOfBirth: userData.dateOfBirth,
        ssn: userData.ssn
      });
      
      const dwollaCustomerUrl = await createDwollaCustomer({
        ...userData,
        type: 'personal'
      })

      if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer')
      console.log('✅ Dwolla customer created:', dwollaCustomerUrl);

      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

      console.log('📝 Creating user document in database...');
      const newUser = await database.createDocument(
        DATABASE_ID!,
        USER_COLLECTION_ID!,
        ID.unique(),
        {
          ...userData,
          userId: newUserAccount.$id,
          dwollaCustomerId,
          dwollaCustomerUrl
        }
      )
      console.log('✅ User document created:', newUser.$id);

      console.log('📝 Creating session...');
      const session = await account.createEmailPasswordSession(email, password);

      cookies().set("appwrite-session", session.secret, {
        path: "/",
        httpOnly: true,
        sameSite: "strict",
        secure: true,
      });
      console.log('✅ Sign-up complete!');

      return parseStringify(newUser);
    } catch (dwollaError: any) {
      // If Dwolla customer creation fails, clean up the orphaned Appwrite user
      console.error('❌ Dwolla customer creation failed, cleaning up Appwrite user...');
      try {
        // Use the admin client to delete the user
        const { user: userService } = await createAdminClient();
        await userService.delete(newUserAccount.$id);
        console.log('✅ Cleaned up orphaned Appwrite user');
      } catch (cleanupError) {
        console.error('⚠️ Failed to clean up Appwrite user:', cleanupError);
      }
      
      // Provide helpful error message
      const errorMsg = dwollaError?.message || 'Dwolla customer creation failed';
      if (errorMsg.includes('email already exists')) {
        throw new Error('This email is already registered in Dwolla. Please use a different email address or contact support if you believe this is an error.');
      }
      throw dwollaError;
    }
  } catch (error) {
    console.error('❌ Sign-up error:', error);
    // Return the error details so the UI can show them
    throw error;
  }
}

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id})

    return parseStringify(user);
  } catch (error) {
    console.log(error)
    return null;
  }
}

export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');

    await account.deleteSession('current');
  } catch (error) {
    return null;
  }
}

export const createLinkToken = async (user: User, redirectUri?: string) => {
  try {
    const tokenParams = {
      user: {
        client_user_id: user.$id
      },
      client_name: `${user.firstName} ${user.lastName}`,
      // request both auth and transactions to allow transactions.sync later
      products: ['auth', 'transactions'] as Products[],
      language: 'en',
      country_codes: ['US'] as CountryCode[],
      // For OAuth flows (e.g., First Platypus Bank in sandbox), Plaid requires an exact redirect_uri.
      // If NEXT_PUBLIC_PLAID_REDIRECT_URI is set, include it here.
      ...(redirectUri
        ? { redirect_uri: redirectUri }
        : process.env.NEXT_PUBLIC_PLAID_REDIRECT_URI
        ? { redirect_uri: process.env.NEXT_PUBLIC_PLAID_REDIRECT_URI as string }
        : {}),
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token })
  } catch (error) {
    console.log(error);
  }
}

export const createBankAccount = async ({
  userId,
  bankId,
  accountId,
  accessToken,
  fundingSourceUrl,
  shareableId,
}: createBankAccountProps) => {
  try {
    const { database } = await createAdminClient();

    const bankAccount = await database.createDocument(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        bankId,
        accountId,
        accessToken,
        fundingSourceUrl,
        shareableId,
      }
    )

    return parseStringify(bankAccount);
  } catch (error) {
    console.log(error);
  }
}

export const exchangePublicToken = async ({
  publicToken,
  user,
}: exchangePublicTokenProps) => {
  try {
    // Exchange public token for access token and item ID
    const response = await plaidClient.itemPublicTokenExchange({
      public_token: publicToken,
    });

    const accessToken = response.data.access_token;
    const itemId = response.data.item_id;
    
    // Get account information from Plaid using the access token
    let accountsResponse;
    try {
      accountsResponse = await plaidClient.accountsGet({ access_token: accessToken });
    } catch (e: any) {
      throw new Error(e?.response?.data?.error_message || 'Failed to fetch Plaid account info');
    }

    const accountData = accountsResponse.data.accounts[0];

    // Create a processor token for Dwolla using the access token and account ID
    const request: ProcessorTokenCreateRequest = {
      access_token: accessToken,
      account_id: accountData.account_id,
      processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
    };

    let processorTokenResponse;
    try {
      processorTokenResponse = await plaidClient.processorTokenCreate(request);
    } catch (e: any) {
      throw new Error(e?.response?.data?.error_message || 'Failed to create Plaid processor token');
    }
    const processorToken = processorTokenResponse.data.processor_token;

     // Create a funding source URL for the account using the Dwolla customer ID, processor token, and bank name
     let fundingSourceUrl;
     try {
  fundingSourceUrl = await addFundingSource({
        dwollaCustomerId: user.dwollaCustomerId,
        processorToken,
   bankName: accountData.name || 'Plaid Account',
       });
       console.log('✅ Dwolla funding source created successfully:', fundingSourceUrl);
     } catch (e: any) {
       // Log the full error for debugging
       console.error('❌ Dwolla funding source error:', e?.message || e);
       
       // Optional dev fallback: allow saving bank without Dwolla funding source
       if (process.env.ALLOW_BANK_SAVE_WITHOUT_DWOLLA === 'true') {
         console.warn('Dwolla funding source failed, saving bank without funding source (dev mode):', e?.message || e);
         fundingSourceUrl = '';
       } else {
         throw new Error(`Dwolla funding source failed: ${e?.message || 'Unknown error'}`);
       }
     }
    
    // If the funding source URL is not created, throw an error (allow empty string in dev bypass mode)
    if ((fundingSourceUrl === undefined || fundingSourceUrl === null) && process.env.ALLOW_BANK_SAVE_WITHOUT_DWOLLA !== 'true') {
      throw new Error('Failed to add funding source for this bank account');
    }

    // Create a bank account using the user ID, item ID, account ID, access token, funding source URL, and shareableId ID
    await createBankAccount({
      userId: user.$id,
      bankId: itemId,
      accountId: accountData.account_id,
      accessToken,
      fundingSourceUrl: fundingSourceUrl || '',
      shareableId: encryptId(accountData.account_id),
    });

    // Revalidate the path to reflect the changes
    revalidatePath("/");

    // Return a success message
    return parseStringify({
      publicTokenExchange: "complete",
    });
  } catch (error) {
    console.error("An error occurred while creating exchanging token:", error);
    // Surface the error upward, so the UI can react if needed
    throw error;
  }
}

export const getBanks = async ({ userId }: getBanksProps) => {
  try {
    const { database } = await createAdminClient();

    const banks = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(banks.documents);
  } catch (error) {
    console.log(error)
  }
}

export const getBank = async ({ documentId }: getBankProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('$id', [documentId])]
    )

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
  try {
    const { database } = await createAdminClient();

    const bank = await database.listDocuments(
      DATABASE_ID!,
      BANK_COLLECTION_ID!,
      [Query.equal('accountId', [accountId])]
    )

    if(bank.total !== 1) return null;

    return parseStringify(bank.documents[0]);
  } catch (error) {
    console.log(error)
  }
}