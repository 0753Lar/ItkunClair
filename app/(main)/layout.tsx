"use client";

import { PropsWithChildren } from "react";
import { notoSans } from "../fonts";
import { QuizProvider } from "../context/quizContext";

interface HomeProps {
  background: React.ReactNode;
  header: React.ReactNode;
}

export default function Layout({
  background,
  header,
  children,
}: PropsWithChildren<HomeProps>) {
  return (
    <QuizProvider>
      {header}
      {background}
      <main className={`${notoSans.className}`}> {children}</main>
    </QuizProvider>
  );
}
