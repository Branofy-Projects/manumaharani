import { SignInForm } from "@/components/auth/sign-in-form";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SignInForm />
    </div>
  );
}

export const metadata = {
  description: "Sign in to your account",
  title: "Sign In",
};
