import "./globals.scss";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";

export const metadata = {
  title: "Bill payment system",
  description: "Prototype for customer billing data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
