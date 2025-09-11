// src/components/CustomerTable.js
"use client";

import { useEffect, useState } from "react";
import PayButton from "./PayButton";

export default function CustomerTable() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => setData(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false));
  }, []);

  // Listen for payment confirmation events to refresh data (client-only update)
  useEffect(() => {
    function handlePaid(e) {
      const paidInvoice = e?.detail?.invoiceNumber;
      if (!paidInvoice) return;
      setData((prev) =>
        Array.isArray(prev)
          ? prev.map((row) =>
              row.invoiceNumber === paidInvoice
                ? { ...row, paymentStatus: "مدفوعة" }
                : row
            )
          : prev
      );
    }
    if (typeof window !== "undefined") {
      window.addEventListener("invoice-paid", handlePaid);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("invoice-paid", handlePaid);
      }
    };
  }, []);

  const trimmed = searchTerm.trim();
  const filtered = trimmed
    ? data.filter((item) => item?.taxId?.toString() === trimmed)
    : [];

  return (
    <div className="p-6" dir="rtl">
        <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">ادخل الرقم الضريبي</label>
            <input 
                placeholder="الرقم الضريبي"
                className="w-full max-w-md rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {isLoading ? (
            <div className="text-sm text-gray-600">جاري التحميل...</div>
        ) : trimmed === "" ? null : (
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 rounded-md border">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">التاريخ</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">رقم الفاتورة</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">رقم البوليصة</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">الرقم الضريبي</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">اسم المستورد</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">قيمة الفاتورة</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">حالة السداد</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">اسم المستخلص</th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-700">الدفع</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-3 py-6 text-center text-sm text-gray-500">لا توجد بيانات مطابقة</td>
                            </tr>
                        ) : (
                            filtered.map((row) => (
                                <tr key={row.invoiceNumber} className="hover:bg-gray-50">
                                    <td className="px-3 py-2 text-sm">{row.date}</td>
                                    <td className="px-3 py-2 text-sm">{row.invoiceNumber}</td>
                                    <td className="px-3 py-2 text-sm">{row.policyNumber}</td>
                                    <td className="px-3 py-2 text-sm">{row.taxId}</td>
                                    <td className="px-3 py-2 text-sm">{row.importerName}</td>
                                    <td className="px-3 py-2 text-sm">{row.invoiceAmount}</td>
                                    <td className="px-3 py-2 text-sm">{row.paymentStatus}</td>
                                    <td className="px-3 py-2 text-sm">{row.brokerName}</td>
                                    <td className="px-3 py-2 text-sm">
                                        {row.paymentStatus === "غير مدفوعة" ? (
                                            <PayButton invoice={row} />
                                        ) : (
                                            <span className="text-green-600">✓</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        )}
    </div>
  );
}
