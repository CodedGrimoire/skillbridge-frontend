"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";
import api from "../../services/api";
import { useSearchParams } from "next/navigation";

function SuccessInner() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [status, setStatus] = useState<"pending" | "verified" | "error">("pending");

  useEffect(() => {
    const verify = async () => {
      if (!sessionId) {
        setStatus("error");
        return;
      }
      try {
        await api.get(`/payments/verify`, { params: { session_id: sessionId } });
        setStatus("verified");
      } catch {
        setStatus("error");
      }
    };
    verify();
  }, [sessionId]);

  const message =
    status === "verified"
      ? "Thanks for your purchase. You can now access your course."
      : status === "error"
      ? "We couldn’t verify the payment. Please check your email or try again."
      : "Verifying payment...";

  return (
    <SectionContainer className="py-16">
      <Card className="p-8 text-center space-y-4">
        <h1 className="text-3xl font-semibold text-white">
          {status === "verified" ? "Payment Successful" : status === "error" ? "Verification Issue" : "Finishing Up"}
        </h1>
        <p className="text-neutral-400">{message}</p>
        <div className="flex justify-center gap-3">
          <Link href="/courses" className="btn-secondary">
            Back to Courses
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </Card>
    </SectionContainer>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<SectionContainer className="py-16"><p className="text-neutral-500">Loading...</p></SectionContainer>}>
      <SuccessInner />
    </Suspense>
  );
}
