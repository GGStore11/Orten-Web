import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/layout/AuthProvider";
import I18nProvider from "@/components/layout/I18nProvider";

export const metadata: Metadata = {
  title: "Orten - Discord Server Management Platform",
  description: "منصة إدارة سيرفرات Discord الاحترافية",
  icons: {
    icon: "https://cdn.discordapp.com/attachments/1483620716212654181/1486541618474385418/Logo_2.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="cyber-grid">
        <AuthProvider>
          <I18nProvider>{children}</I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
