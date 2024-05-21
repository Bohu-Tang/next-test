import '@/app/ui/global.css';
import {inter} from "@/app/ui/fonts";
import {Metadata} from "next";

export const metadata: Metadata={
  title: '发票管理系统',
  description: 'layout中的描述信息',
  metadataBase: new URL('https://ai.fire-doge.com')
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
