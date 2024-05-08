import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.scss";

const lobster = Roboto({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chácara do Dandão",
  description:
    "Alugue a Chácara do Dandão e curta seu dia de forma memorável e em meio a natureza!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={lobster.className}>{children}</body>
    </html>
  );
}
