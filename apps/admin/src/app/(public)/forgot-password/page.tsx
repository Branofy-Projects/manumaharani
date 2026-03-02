import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <ForgotPasswordForm />
    </div>
  );
}

export const metadata = {
  description: "Reset your password",
  title: "Forgot Password",
};
