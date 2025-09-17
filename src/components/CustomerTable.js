// src/components/CustomerTable.js
"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fetchWithAuth } from "@/lib/api";
import InvoiceModal from "./InvoiceModal/InvoiceModal";

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {Array(9)
      .fill(0)
      .map((_, i) => (
        <td key={i} className="px-3 py-4">
          <div className="h-4 bg-gray-200 rounded"></div>
        </td>
      ))}
  </tr>
);

export default function CustomerTable() {
  const [isOpen, setIsOpen] = useState(false);
  const [invoice, setInvoice] = useState(null);

  const openInvoice = (row) => {
    setInvoice(row);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setInvoice(null);
  };

  const { data = [], isLoading, error, } = useQuery({
    queryKey: ["customers"],
    queryFn: async ({ signal }) => {
      try {
        const url = "/api/customers";

        console.log("🌐 [CustomerTable] API Request:", { url });

        const response = await fetchWithAuth(url, { signal });

        console.log("📡 [CustomerTable] Response Received:", {
          status: response.status,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ [CustomerTable] API Error:", { error: errorText });
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorText}`
          );
        }

        const responseData = await response.json();

        if (!Array.isArray(responseData)) {
          console.error(
            "❌ [CustomerTable] Unexpected response format:",
            responseData
          );
          throw new Error("Expected an array of customers");
        }

        console.log("✅ [CustomerTable] API Success:", {
          itemCount: responseData.length,
          firstItem: responseData[0]
            ? Object.entries(responseData[0]).slice(0, 3)
            : "No items",
        });

        return responseData;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("❌ [CustomerTable] Fetch Error:", {
            message: error.message,
          });
        }
        throw error;
      }
    },
    retry: 1,
    refetchOnWindowFocus: false,
    onError: (error) => {
      if (error.name !== "AbortError") {
        console.error("❌ [CustomerTable] Query Error:", error.message);
      }
    },
    onSettled: () => {
      console.log("🏁 [CustomerTable] Query settled");
    },
  });

  const renderTableContent = () => {
    if (isLoading) {
      return Array(5)
        .fill(0)
        .map((_, i) => <SkeletonRow key={i} />);
    }

    if (error) {
      return (
        <tr>
          <td colSpan="9" className="px-3 py-4 text-center text-red-500">
            {error.message}
          </td>
        </tr>
      );
    }

    if (!data || data.length === 0) {
      return (
        <tr>
          <td colSpan="9" className="px-3 py-4 text-center text-gray-500">
            لا توجد بيانات متاحة
          </td>
        </tr>
      );
    }

    return data.map((row, index) => (
      <tr key={index} className="hover:bg-gray-50">
        <td className="px-3 py-2 text-sm">{row["Draft Nbr"] || "-"}</td>
        <td className="px-3 py-2 text-sm">{row["Final Nbr"] || "-"}</td>
        <td className="px-3 py-2 text-sm">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.Status === "Final"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.Status === "Final" ? "نهائي" : row.Status || "معلق"}
          </span>
        </td>
        <td className="px-3 py-2 text-sm">{row["Contract Customer"] || "-"}</td>
        <td className="px-3 py-2 text-sm">{row["Key Word 2"] || "-"}</td>
        <td className="px-3 py-2 text-sm">{row["Finalized Date"] || "-"}</td>
        <td className="px-3 py-2 text-sm">{row["Payee Name"] || "-"}</td>
        <td className="px-3 py-2 text-sm">
          {row["Owed"] ? `${row["Owed"]} ${row.Currency || "EGP"}` : "-"}
        </td>
        <td className="px-3 py-2 text-sm">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              row.PaidInFull === "true"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {row.PaidInFull === "true" ? "مدفوعة" : "غير مدفوعة"}
          </span>
        </td>
        <td className="px-3 py-2 text-sm">
          <button
            onClick={() => openInvoice(row)}
            className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
          >
            معاينة الفاتورة
          </button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">فواتير العملاء</h2>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                رقم المسودة
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                الرقم النهائي
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                الحالة
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                الرقم الضريبي
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                رقم البوليصة
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                تاريخ الإصدار
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                اسم المستفيد
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                إجمالي المبلغ
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                حالة الدفع
              </th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">
                الفاتورة
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {renderTableContent()}
          </tbody>
        </table>
      </div>
      <InvoiceModal
        isOpen={isOpen}
        invoice={invoice}
        closeModal={closeModal}
      />
    </div>
  );
}

