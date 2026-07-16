import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "生命火花连接｜你靠什么确认自己正在活着？",
  description: "沿着一段生命连接探索，照见你长久以来与世界相遇的方向，也听见此刻生命正在发出的邀请。",
  openGraph: {
    title: "生命火花连接",
    description: "你靠什么，确认自己正在活着？",
    type: "website",
  },
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="zh-CN"><body>{children}</body></html>;
}
