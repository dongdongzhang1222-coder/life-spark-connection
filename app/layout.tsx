import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "生命火花连接｜你靠什么确认自己正在活着？",
  description: "十个片刻，照见你长久以来与世界连接的方向，也听见此刻生命正在发出的邀请。",
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="zh-CN"><body>{children}</body></html>;
}
