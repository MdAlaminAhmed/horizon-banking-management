"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";

import {
  cn,
  formUrlQuery,
  formatAmount,
  getAccountTypeColors,
} from "@/lib/utils";

const BankInfo = ({ account, appwriteItemId, type }: BankInfoProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isActive = appwriteItemId === account?.appwriteItemId;

  const handleBankChange = () => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "id",
      value: account?.appwriteItemId,
    });
    router.push(newUrl, { scroll: false });
  };

  const colors = getAccountTypeColors(account?.type as AccountTypes);

  return (
    <div
      onClick={handleBankChange}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors",
        type === "card" && "cursor-pointer shadow-sm",
        type === "card" && isActive && "ring-2 ring-blue-500"
      )}
    >
      {/* Bank Icon */}
      <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-16 shrink-0">
        {account.name.substring(0, 2).toUpperCase()}
      </div>

      {/* Bank Details */}
      <div className="flex-1 min-w-0">
        <h2 className="text-16 font-bold text-gray-900 truncate">
          {account.name}
        </h2>
        <p className="text-14 font-semibold text-blue-600">
          {formatAmount(account.currentBalance)}
        </p>
      </div>

      {/* Account Type Badge */}
      {type === "full" && (
        <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-12 font-medium capitalize">
          {account.subtype}
        </div>
      )}
    </div>
  );
};

export default BankInfo;
