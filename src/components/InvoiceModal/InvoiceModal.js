// "use client";

import { useState } from "react";
import logoBase64 from "@/assets/logoBase64";
import pdfMake, { fonts } from "pdfmake/build/pdfmake";
import vfsFonts from "@/pdf/vfs_fonts";

pdfMake.vfs = vfsFonts;

pdfMake.fonts = {
  Cairo: {
    normal: "Cairo-Regular.ttf",
    bold: "Cairo-Bold.ttf",
  },
};

export default function InvoiceModal({ isOpen, invoice, closeModal }) {
  const [pdfUrl, setPdfUrl] = useState(null);
  if (!isOpen) return null;

  function fixRTL(text) {
    if (!text) return "";
    return text.split(" ").reverse().join(" ").trim();
  }

  const testInvoice = {
    desc: "خدمات   اخرى مؤداه للحاويه 40",
    date: "2025-09-15",
    tariff: "TRF-01",
    days: "3",
    containers: "2",
    price: 500,
    total: 1000,
  };

  const items = [
    {
      desc: testInvoice.desc,
      date: testInvoice.date,
      tariff: testInvoice.tariff,
      days: testInvoice.days,
      containers: testInvoice.containers,
      price: testInvoice.price,
      total: testInvoice.total,
    },
  ];

  const tableDefinition = {
    table: {
      headerRows: 1,
      widths: [195, "auto", 90, "auto", "auto", "auto", "auto"],
      body: [
        // ✅ الصف الأول (العناوين)
        [
          {
            text: fixRTL("الوصف"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("تاريخ  الصرف"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("التعريفة"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("الأيام"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("العدد"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("السعر"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
          {
            text: fixRTL("الإجمالي"),
            bold: true,
            alignment: "center",
            valign: "middle",
          },
        ],

        // ✅ الصفوف الديناميكية بناءً على وجود التعريفة
        ...(items || [])
          .filter((item) => item.tariff && item.tariff.trim() !== "")
          .map((item) => [
            {
              text: fixRTL(item.desc) || "",
              alignment: "center",
              valign: "middle",
            },
            { text: item.date || "", alignment: "center", valign: "middle" },
            { text: item.tariff || "", alignment: "center", valign: "middle" },
            { text: item.days || "", alignment: "center", valign: "middle" },
            {
              text: item.containers || "",
              alignment: "center",
              valign: "middle",
            },
            {
              text: item.price ? item.price.toFixed(2) : "",
              alignment: "center",
              valign: "middle",
            },
            {
              text: item.total ? item.total.toFixed(2) : "",
              alignment: "center",
              valign: "middle",
            },
          ]),
      ],
    },
    layout: {
      hLineWidth: function (i, node) {
        return 1;
      }, // سمك الخطوط الأفقية
      vLineWidth: function (i, node) {
        return 1;
      }, // سمك الخطوط العمودية
      hLineColor: function (i, node) {
        return "#000";
      }, // لون الخطوط الأفقية
      vLineColor: function (i, node) {
        return "#000";
      }, // لون الخطوط العمودية
    },

    margin: [0, 10, 0, 0],
  };

  const summaryTable = {
    table: {
      headerRows: 0, // مفيش هيدر منفصل
      widths: ["*", "auto"], // عمود أول واسع + عمود ثاني ضيق للقيم
      body: [
        [
          {
            text: fixRTL("الصافي USD"),
            bold: true,
            alignment: "right",
            fontSize: 10,
          },
          { text: "50.00", alignment: "center" },
        ],
        [
          {
            text: fixRTL("صافي  الفاتورة مقيم"),
            alignment: "right",
            fontSize: 10,
          },
          { text: "1550.00", alignment: "center" },
        ],
        [
          {
            text: fixRTL("ضريبة  القيمة  المضافة EGP"),
            bold: true,
            alignment: "right",
            fontSize: 10,
          },
          { text: "1550.00", alignment: "center" },
        ],
        [
          {
            text: fixRTL(" إجمالى  الفاتورة بعد إضافة الضرائب EGP"),
            alignment: "right",
            fontSize: 10,
          },
          { text: "200.00", alignment: "center" },
        ],
        [
          {
            text: fixRTL("مقابل  طابع الشهيد"),
            bold: true,
            alignment: "right",
            fontSize: 10,
          },
          { text: "5.00", alignment: "center" },
        ],
        [
          {
            text: fixRTL("إجمالى  الفاتورة بعد إضافة الضرائب وطابع الشهيد EGP"),
            alignment: "right",
            fontSize: 10,
          },
          { text: "1750.00", alignment: "center" },
        ],
      ],
    },
    layout: {
      hLineWidth: function () {
        return 0.5;
      },
      vLineWidth: function () {
        return 0.5;
      },
      hLineColor: function () {
        return "#aaa";
      },
      vLineColor: function () {
        return "#aaa";
      },
      paddingLeft: function () {
        return 5;
      },
      paddingRight: function () {
        return 5;
      },
      paddingTop: function () {
        return 0;
      },
      paddingBottom: function () {
        return 0;
      },
    },
    margin: [0, 10, 0, 0],
  };

  const footerTables = {
    
    columns: [

      // ✅ Second table (2 columns x 2 rows)
      {
        width: "40%", // ياخد 40% من عرض الصفحة
        table: {
          headerRows: 0,
          widths: ["*", "*"],
          body: [
            [
              { text: fixRTL("مدير  إدارة  المراجعة"), alignment: "center", bold: true, fontSize: 10 },
              { text: fixRTL("مراجع"), alignment: "center", bold: true, fontSize: 10 },
            ],
            [
              { text: "", alignment: "center", fontSize: 10 },
              { text: "Mosaad", alignment: "center", fontSize: 10 },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa",
        },
        margin: [0, 10, 0, 0],
      },
      // ✅ First table (3 columns x 2 rows)
      {
        width: "60%", // ياخد 60% من عرض الصفحة
        table: {
          headerRows: 0,
          widths: ["*", "*", "*"],
          body: [
            [
              { text: fixRTL("مدير  الايرادات"), alignment: "center", bold: true, fontSize: 10 },
              { text: fixRTL("مراجع"), alignment: "center", bold: true, fontSize: 10 },
              { text: fixRTL("محاسب"), alignment: "center", bold: true, fontSize: 10 },
            ],
            [
              { text: "", alignment: "center", fontSize: 10 },
              { text: "", alignment: "center", fontSize: 10 },
              { text: "ASHRAF", alignment: "center", fontSize: 10 },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => "#aaa",
          vLineColor: () => "#aaa",
        },
        margin: [0, 10, 0, 0],
      },
    ],
    columnGap: 20, // مسافة بين الجدولين
  };

  const generatePDF = (action) => {
    if (!invoice) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-US");

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [20, 10, 20, 0],

      content: [
        // ✅ Header
        {
          columns: [
            // Left column (logo + tax registration)
            {
              stack: [
                logoBase64
                  ? {
                      image: logoBase64,
                      width: 80,
                      alignment: "right",
                      margin: [-5, 0, 0, 0],
                    }
                  : {},
                {
                  stack: [
                    {
                      stack: [
                        {
                          text: fixRTL("تسجيـل  ضريبي"),
                          fontSize: 11,
                          alignment: "right",
                          margin: [0, 0, 0, 0],
                        },
                        {
                          canvas: [
                            {
                              type: "line",
                              x1: 0,
                              y1: 0,
                              x2: 62,
                              y2: 0,
                              lineWidth: 0.9,
                            },
                          ],
                          alignment: "right",
                          margin: [0, 0, 0, 0],
                        },
                        {
                          text: fixRTL("100/221/823"),
                          fontSize: 11,
                          alignment: "right",
                          margin: [0, 0, 0, 0],
                        },
                        {
                          canvas: [
                            {
                              type: "line",
                              x1: 0,
                              y1: 0,
                              x2: 62,
                              y2: 0,
                              lineWidth: 0.9,
                            },
                          ],
                          alignment: "right",
                        },
                      ],
                    },
                  ],
                  alignment: "right",
                                    

                },
              ],
              width: "auto",
            },

            // Middle column (company data)
            {
              stack: [
                {
                  text: fixRTL("فرع  شركة دمياط لتداول الحاويات والبضائع"),
                  fontSize: 14,
                },
                { text: fixRTL("منطقة  حرة خاصة"), fontSize: 12 },
                {
                  text: fixRTL("قطاع  الشئون المالية والإقتصادية"),
                  fontSize: 12,
                },
                {
                  text: fixRTL("إدارة  الإيرادات"),
                  fontSize: 14,
                  bold: true,
                },
              ],
              alignment: "center",
              margin: [0, 0, 0, 20],
              width: "*", // Takes the remaining offer
            },

            // Right column (print date)
            {
              stack: [
                { text: formattedDate },
                { text: formattedTime },
                {
                  text: fixRTL(`رقم  الأمانة: 8`),
                  fontSize: 10,
                  bold: true,
                },
              ],
              alignment: "left",
              fontSize: 9,
              margin: [0, 0, 0, 0],
              width: "auto",
            },
          ],
          columnGap: 4, // Distance between columns
        },
        // ✅ Billing address
        {
          columns: [
            {
              stack: [
                {
                  text: fixRTL("فاتورة  تحصيل نقدي"),
                  fontSize: 14,
                  bold: true,
                  alignment: "center",
                  margin: [0, 0, 0, 2],
                },
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 120,
                      y2: 0,
                      lineWidth: 1,
                    },
                  ],
                  alignment: "center",
                },
              ],
            },
          ],
        },
        // ✅ Basic data
        {
          columns: [
            // Left column
            // ✅ Table of items
            {
              table: {
                widths: [115, 115], // عمود أول صغير للعناوين + عمود ثاني واسع للقيم
                body: [
                  [
                    {
                      text: fixRTL(invoice["Key Word 1"]) || "",
                      alignment: "right",
                      fontSize: 10,
                    },
                    {
                      text: fixRTL("اسم  السفينة"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: fixRTL(invoice["Key"]) || "25032",
                      fontSize: 10,
                      alignment: "right",
                    },
                    {
                      text: fixRTL("رقم  الرحلة"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: fixRTL(invoice["Key"]) || "12/09/2025 00:15",
                      alignment: "right",
                      fontSize: 10,
                    },
                    {
                      text: fixRTL("ميعاد  الوصول"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: fixRTL(invoice["Key"]) || "14/09/2025 14:20",
                      alignment: "right",
                      fontSize: 10,
                    },
                    {
                      text: fixRTL("تاريخ  الصرف"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: fixRTL(invoice["Key"]) || "16/09/2025 14:05",
                      alignment: "right",
                      fontSize: 10,
                    },
                    {
                      text: fixRTL("تاريخ  الاصدار"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    {
                      text: fixRTL(invoice["Key Word 2"]) || "",
                      alignment: "right",
                      fontSize: 10,
                    },
                    {
                      text: fixRTL("رقم  البوليصة"),
                      bold: true,
                      fontSize: 10,
                      alignment: "right",
                    },
                  ],
                  [
                    { text: fixRTL(invoice["Key"]) || "", alignment: "right", fontSize: 10, },
                    {
                      text: fixRTL("بوليصة  مجمعة"),
                      fontSize: 10,
                      bold: true,
                      alignment: "right",
                    },
                  ],
                ],
              },
              layout: {
                hLineWidth: function (i, node) {
                  return 0.5; // سمك الخط الأفقي
                },
                vLineWidth: function () {
                  return 0; // بدون خطوط عمودية
                },
                hLineColor: function (i, node) {
                  return "#aaa"; // لون الخطوط الأفقية
                },
                paddingLeft: function () {
                  return 5;
                },
                paddingRight: function () {
                  return 5;
                },
                paddingTop: function () {
                  return 0;
                },
                paddingBottom: function () {
                  return 0;
                },
              },
              margin: [0, 20, 0, 0],
            },

            // Right column
            {
              stack: [
                {
                  text: fixRTL(
                    `رقم  الفاتورة: ${invoice["Final Nbr"] || ""} - ${
                      invoice["Draft Nbr"] || ""
                    }`
                  ),
                  alignment: "right",
                  fontSize: 10,
                  margin: [0, 0, 0, 5],
                },
                {
                  text: fixRTL(`اسم  المكتب: ${invoice["Payee"] || ""}`),
                  alignment: "right",
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: fixRTL(`اسم  التوكيل: ${invoice["Key Word 3"] || ""}`),
                  alignment: "right",
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: fixRTL(`سعر  الصرف: ${invoice["Key"] || "48.43 EGP"}`),
                  alignment: "right",
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: fixRTL(
                    `اسم  العميل: ${invoice["Contract Customer Name"] || ""}`
                  ),
                  alignment: "right",
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
                {
                  text: fixRTL(
                    `الرقم  الضريبي: ${invoice["Contract Customer"] || ""}`
                  ),
                  alignment: "right",
                  margin: [0, 0, 0, 5],
                  fontSize: 10,
                },
              ],
              width: "auto",
              margin: [0, 20, 0, 0],
            },
          ],
          columnGap: 4,
        },
        tableDefinition,
        {
          text: fixRTL(
            "لا مانع من صرف مشمول البوليصة عالية تحت الملاحظة الجمركية"
          ),
          fontSize: 14,
          bold: true,
          alignment: "center",
          margin: [0, 4, 0, 10],
        },
        // Date:   /    /  
        {
          text: fixRTL("تاريخ:       /            /         "),
          fontSize: 14,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 20],
        },
        // FINAL
        {
          text: "FINAL",
          fontSize: 14,
          bold: true,
          alignment: "center",
          margin: [0, 20, 0, 40],
        },
        // ----- Line across the page -----
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 0, 0, 0],
        },
        summaryTable,
        // ----- Line across the page -----
        {
          canvas: [
            { type: "line", x1: 0, y1: 0, x2: 555, y2: 0, lineWidth: 1 },
          ],
          margin: [0, 10, 0, 0],
        },
        footerTables,
      ],

      defaultStyle: {
        font: "Cairo",
      },
      styles: {
        header: { fontSize: 16, bold: true },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);

    if (action === "open") {
      pdfDocGenerator.open();
    } else if (action === "download") {
      pdfDocGenerator.download(`invoice-${invoice["Draft Nbr"]}.pdf`);
    } else if (action === "print") {
      pdfDocGenerator.print();
    } else {
      pdfDocGenerator.getBlob((blob) => {
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 max-h-[90vh] overflow-auto">
        <h2 className="text-lg font-bold mb-4">معاينة الفاتورة</h2>

        {/* أزرار التحكم */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => generatePDF("download")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            تحميل
          </button>
          <button
            onClick={() => generatePDF("print")}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            طباعة
          </button>
          <button
            onClick={closeModal}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            إغلاق
          </button>
          <button
            onClick={() => generatePDF("preview")}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            تحديث المعاينة
          </button>
        </div>

        {/* ✅ iframe للمعاينة */}
        {pdfUrl ? (
          <iframe src={pdfUrl} className="w-full h-[70vh]" />
        ) : (
          <p className="text-gray-500">
            اضغط على "تحديث المعاينة" لرؤية الفاتورة
          </p>
        )}
      </div>
    </div>
  );
}
