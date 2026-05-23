import { isDemoMode, isPrivyConfigured } from "@/lib/env";
import { SignInCard } from "./sign-in-card";
import { DemoRolePicker } from "./demo-role-picker";

export function AuthCard() {
  if (isDemoMode() && !isPrivyConfigured()) {
    return <DemoRolePicker />;
  }
  return <SignInCard />;
}
