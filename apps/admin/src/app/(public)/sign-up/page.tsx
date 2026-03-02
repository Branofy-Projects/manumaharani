import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <SignUpForm />
    </div>
  );
}

export const metadata = {
  description: "Create a new account",
  title: "Sign Up",
};
