"use client";

import type { ReactNode } from "react";
import { TamboProvider, TamboStubProvider } from "@tambo-ai/react";
import { planComponentList } from "./cards";

const TAMBO_API_KEY = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

export function CarePlanProvider({
  userKey,
  children,
}: {
  userKey: string;
  children: ReactNode;
}) {
  if (TAMBO_API_KEY) {
    return (
      <TamboProvider
        apiKey={TAMBO_API_KEY}
        userKey={userKey}
        components={planComponentList}
      >
        {children}
      </TamboProvider>
    );
  }
  return (
    <TamboStubProvider userKey={userKey} components={planComponentList}>
      {children}
    </TamboStubProvider>
  );
}
