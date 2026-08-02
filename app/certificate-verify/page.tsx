import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export const metadata: Metadata = {
  title: "Certificate Verify",
  description:
    "Verify Fly Aerotech Solutions certificates with a unique reference number. This feature will be available soon.",
};

export default function CertificateVerifyPage() {
  return (
    <EmptyState
      icon={ShieldCheck}
      title="Certificate Verification"
      description="This portal will let you verify training, internship and experience certificates using their unique reference number. The verification engine is planned for a future phase."
    />
  );
}
