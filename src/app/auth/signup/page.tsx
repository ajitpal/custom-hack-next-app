"use client";
import AuthForm from "@/components/better-auth/auth-form";
import OnboardingForm from "@/components/auth/onboarding-form";
import Section from "@/components/common/section";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const router = useRouter();
  const [error, setError] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userId, setUserId] = useState<string>("");

  const handleSignUp = async (email: string, password: string) => {
    await authClient.signUp.email(
      {
        name: email,
        email,
        password,
      },
      {
        onResponse: () => {
          setIsLoading(false);
        },
        onRequest: () => {
          setError(null);
          setIsLoading(true);
        },
        onSuccess: () => {
          // Show onboarding form instead of redirecting immediately
          setShowOnboarding(true);
        },
        onError: (ctx) => {
          setError(ctx.error.message);
        },
      }
    );
  };

  const handleOnboardingComplete = () => {
    router.push("/");
  };

  if (showOnboarding) {
    return (
      <Section title="Welcome! Let's personalize your experience">
        <OnboardingForm onComplete={handleOnboardingComplete} />
      </Section>
    );
  }

  return (
    <Section title="Sign up">
      <p>
        If you already have an account,{" "}
        <Link href="/auth/login" className="text-blue-500 underline">
          login
        </Link>
        . Otherwise, sign up here 👇
      </p>
      <AuthForm onSubmit={handleSignUp} isLoading={isLoading} />
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </Section>
  );
}
