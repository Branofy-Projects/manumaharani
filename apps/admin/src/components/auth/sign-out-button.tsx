"use client";

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { useAuth } from './auth-provider';

interface SignOutButtonProps {
  children?: React.ReactNode;
  className?: string;
  showIcon?: boolean;
  size?: "default" | "icon" | "lg" | "sm";
  variant?:
  | "default"
  | "destructive"
  | "ghost"
  | "link"
  | "outline"
  | "secondary";
}

export function SignOutButton({
  children,
  className,
  showIcon = true,
  size = "default",
  variant = "ghost",
}: SignOutButtonProps) {
  const { signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      // Redirect to sign-in page after successful sign out
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      className={className}
      disabled={isLoading}
      onClick={handleSignOut}
      size={size}
      variant={variant}
    >
      {showIcon && <LogOut className="h-4 w-4 mr-2" />}
      {children || (isLoading ? "Signing out..." : "Sign out")}
    </Button>
  );
}
