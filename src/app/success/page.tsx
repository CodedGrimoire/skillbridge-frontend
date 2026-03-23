import Link from "next/link";
import Card from "../../components/ui/Card";
import SectionContainer from "../../components/ui/SectionContainer";

export default function SuccessPage() {
  return (
    <SectionContainer className="py-16">
      <Card className="p-8 text-center space-y-4">
        <h1 className="text-3xl font-semibold text-white">Payment Successful</h1>
        <p className="text-neutral-400">Thanks for your purchase. You can now access your course.</p>
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
