import "./globals.scss";

export const metadata = {
  title: "N4 Billing MVP",
  description: "Prototype for customer billing data",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {children}
      </body>
    </html>
  );
}
