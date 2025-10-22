"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { createTransfer } from "@/lib/actions/dwolla.actions";
import { createTransaction } from "@/lib/actions/transaction.actions";
import { getBank, getBankByAccountId } from "@/lib/actions/user.actions";
import { decryptId } from "@/lib/utils";

import { BankDropdown } from "./BankDropdown";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(4, "Transfer note is too short"),
  amount: z.string().min(4, "Amount is too short"),
  senderBank: z.string().min(4, "Please select a valid bank account"),
  sharableId: z.string().min(8, "Please select a valid sharable Id"),
});

const PaymentTransferForm = ({ accounts }: PaymentTransferFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      amount: "",
      senderBank: "",
      sharableId: "",
    },
  });

  const submit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setStatusMessage("Validating transfer details...");

    try {
      console.log('🚀 Starting transfer process...');
      console.log('📝 Form data:', data);

      // Decrypt and get receiver bank
      setStatusMessage("Verifying receiver information...");
      const receiverAccountId = decryptId(data.sharableId);
      console.log('🔓 Decrypted receiver account ID:', receiverAccountId);

      const receiverBank = await getBankByAccountId({
        accountId: receiverAccountId,
      });
      console.log('🏦 Receiver bank:', receiverBank);

      if (!receiverBank) {
        setStatusMessage('❌ Receiver bank not found. Please check the Sharable ID.');
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      if (!receiverBank.fundingSourceUrl) {
        setStatusMessage('❌ Receiver bank does not have a valid funding source.');
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      // Get sender bank
      setStatusMessage("Verifying your bank account...");
      const senderBank = await getBank({ documentId: data.senderBank });
      console.log('🏦 Sender bank:', senderBank);

      if (!senderBank) {
        setStatusMessage('❌ Sender bank not found. Please select a valid bank.');
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      if (!senderBank.fundingSourceUrl) {
        setStatusMessage('❌ Your bank does not have a valid funding source.');
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      // Create transfer
      setStatusMessage("Processing transfer...");
      const transferParams = {
        sourceFundingSourceUrl: senderBank.fundingSourceUrl,
        destinationFundingSourceUrl: receiverBank.fundingSourceUrl,
        amount: data.amount,
      };
      console.log('💸 Creating Dwolla transfer:', transferParams);

      const transfer = await createTransfer(transferParams);
      console.log('✅ Transfer created:', transfer);

      if (!transfer) {
        setStatusMessage('❌ Failed to create transfer. Please try again.');
        setTimeout(() => setIsLoading(false), 2000);
        return;
      }

      // Create transfer transaction record
      setStatusMessage("Saving transaction record...");
      const transaction = {
        name: data.name,
        amount: data.amount,
        senderId: senderBank.userId,
        senderBankId: senderBank.$id,
        receiverId: receiverBank.userId,
        receiverBankId: receiverBank.$id,
        email: data.email,
      };
      console.log('📝 Creating transaction record:', transaction);

      const newTransaction = await createTransaction(transaction);
      console.log('✅ Transaction record created:', newTransaction);

      if (newTransaction) {
        setStatusMessage('✅ Transfer successful! Redirecting...');
        form.reset();
        // Refresh the router to get fresh data, then navigate
        router.refresh();
        // Wait a moment before redirecting so user sees success message
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setStatusMessage('⚠️ Transfer completed but failed to save transaction record.');
        setTimeout(() => setIsLoading(false), 2000);
      }
    } catch (error) {
      console.error("❌ Transfer failed:", error);
      setStatusMessage(`❌ Transfer failed: ${(error as Error).message || 'Unknown error'}`);
      setTimeout(() => setIsLoading(false), 3000);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submit)} className="flex flex-col">
        <FormField
          control={form.control}
          name="senderBank"
          render={() => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Select Source Bank
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Select the bank account you want to transfer funds from
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <BankDropdown
                      accounts={accounts}
                      setValue={form.setValue}
                      otherStyles="!w-full"
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-6 pt-5">
                <div className="payment-transfer_form-content">
                  <FormLabel className="text-14 font-medium text-gray-700">
                    Transfer Note (Optional)
                  </FormLabel>
                  <FormDescription className="text-12 font-normal text-gray-600">
                    Please provide any additional information or instructions
                    related to the transfer
                  </FormDescription>
                </div>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Textarea
                      placeholder="Write a short note here"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_form-details">
          <h2 className="text-18 font-semibold text-gray-900">
            Bank account details
          </h2>
          <p className="text-16 font-normal text-gray-600">
            Enter the bank account details of the recipient
          </p>
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Recipient&apos;s Email Address
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: johndoe@gmail.com"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sharableId"
          render={({ field }) => (
            <FormItem className="border-t border-gray-200">
              <div className="payment-transfer_form-item pb-5 pt-6">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Receiver&apos;s Plaid Sharable Id
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="Enter the public account number"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="border-y border-gray-200">
              <div className="payment-transfer_form-item py-5">
                <FormLabel className="text-14 w-full max-w-[280px] font-medium text-gray-700">
                  Amount
                </FormLabel>
                <div className="flex w-full flex-col">
                  <FormControl>
                    <Input
                      placeholder="ex: 5.00"
                      className="input-class"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-12 text-red-500" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <div className="payment-transfer_btn-box">
          <Button type="submit" className="payment-transfer_btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" /> &nbsp; {statusMessage || "Sending..."}
              </>
            ) : (
              "Transfer Funds"
            )}
          </Button>

          {/* Status message display */}
          {isLoading && statusMessage && (
            <div className="mt-4 text-center">
              <p className={`text-14 font-medium ${statusMessage.includes('✅') ? 'text-green-600' :
                  statusMessage.includes('❌') ? 'text-red-600' :
                    'text-blue-600'
                }`}>
                {statusMessage}
              </p>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default PaymentTransferForm;
