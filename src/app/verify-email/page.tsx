"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import {
  XCircleIcon,
  CheckCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { Loader } from "@/components/ui/Loader";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<
    "waiting" | "loading" | "success" | "error"
  >("waiting");
  const [message, setMessage] = useState(
    "Please check your email for the verification link"
  );

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("waiting");
      setMessage("Please check your email for the verification link");
      return;
    }

    const verifyEmail = async () => {
      setStatus("loading");
      setMessage("Verifying your email...");

      try {
        const response = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus("error");
          setMessage(data.error || "Verification failed");
          return;
        }

        setStatus("success");
        setMessage("Email verified successfully. Signing you in...");

        // Sign in after verification
        const result = await signIn("credentials", {
          email: data.user.email,
          isVerification: "true",
          redirect: true,
          callbackUrl: "/",
        });
      } catch (error) {
        console.error("Verification error:", error);
        setStatus("error");
        setMessage("An error occurred during verification");
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full mx-4">
        <div className="bg-primary-dark rounded-lg shadow-xl p-8 text-center">
          <div className="mb-6">
            {status === "waiting" && (
              <EnvelopeIcon className="h-12 w-12 text-accent mx-auto" />
            )}
            {status === "loading" && (
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent mx-auto" />
            )}
            {status === "success" && (
              <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto" />
            )}
            {status === "error" && (
              <XCircleIcon className="h-12 w-12 text-red-500 mx-auto" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            {status === "waiting"
              ? "Check Your Email"
              : status === "success"
              ? "Verification Successful"
              : "Verification Failed"}
          </h1>

          <p className="text-gray-300 mb-6">{message}</p>

          {status === "error" && (
            <Link
              href="/login"
              className="inline-block bg-accent hover:bg-accent/90 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              Return to login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<Loader />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
