import type { Metadata } from "next";
import "./globals.css";
import { PropsWithChildren } from "react";
import { RootProvider } from "./context/rootContext";

export const metadata: Metadata = {
  title: "ItkunClair",
  description: "All free website for training your English",
  referrer: "no-referrer",
};

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to the environment variables");
}

export default async function RootLayout({ children }: PropsWithChildren) {
  return <RootProvider>{children}</RootProvider>;
}
