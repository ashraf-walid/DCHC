// src/components/PayButton.js
"use client";

import { useMemo, useState } from "react";

export default function PayButton({ invoice }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  const [cardholder, setCardholder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState(""); // MM/YY
  const [cvv, setCvv] = useState("");
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState("");

  const prettyAmount = useMemo(() => {
    const n = Number(invoice?.invoiceAmount || 0);
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }, [invoice]);

  async function submitPayment(e) {
    e.preventDefault();
    setFormError("");
    // Skip validation and backend call; simulate processing then success
    setLoading(true);
    setMsg("Processing payment...");
    setTimeout(() => {
      setOpen(false);
      setMsg("✓ تم الدفع بنجاح");
      // Clear form
      setCardholder("");
      setCardNumber("");
      setExpiry("");
      setCvv("");
      setEmail("");
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("invoice-paid", { detail: { invoiceNumber: invoice.invoiceNumber } })
        );
      }
      setLoading(false);
    }, 1500);
  }

  function onOpen() {
    setFormError("");
    setOpen(true);
  }

  function formatCardNumber(value) {
    const digits = (value || "").replace(/\D/g, "").slice(0, 19);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  }

  function onChangeExpiry(value) {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return setExpiry(digits);
    setExpiry(digits.slice(0, 2) + "/" + digits.slice(2));
  }

  return (
    <div>
      {msg !== "✓ تم الدفع بنجاح" && (
        <button
          onClick={onOpen}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "جارى الدفع ..." : "ادفع الان"}
        </button>
      )}
      {msg && <p className="mt-2 text-sm text-green-700">{msg}</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pay invoice #{invoice.invoiceNumber}</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded p-1 text-gray-500 hover:bg-gray-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-sm text-gray-600">
              Amount: <span className="font-medium">{prettyAmount}</span>
            </p>

            {formError && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {formError}
              </div>
            )}

            <form onSubmit={submitPayment} className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Cardholder name</label>
                <input
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="John Doe"
                  value={cardholder}
                  onChange={(e) => setCardholder(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Card number</label>
                <input
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value)}
                  maxLength={19 + 3}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-sm font-medium">Expiry (MM/YY)</label>
                  <input
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    inputMode="numeric"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => onChangeExpiry(e.target.value)}
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">CVV</label>
                  <input
                    className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                    inputMode="numeric"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Email (optional)</label>
                <input
                  type="email"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
                >
                  {loading ? "Processing..." : "Pay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


