import Link from "next/link";
import Card from "../components/ui/Card";
import SectionContainer from "../components/ui/SectionContainer";

export default function NotFound() {
  return (
    <SectionContainer className="py-16">
      <Card className="p-8 text-center space-y-4">
        <h1 className="text-3xl font-semibold text-white">Page not found</h1>
        <p className="text-neutral-500">The page you’re looking for doesn’t exist or was moved.</p>
        <div className="flex justify-center gap-3">
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
          <Link href="/" className="btn-secondary">
            Home
          </Link>
        </div>
      </Card>
    </SectionContainer>
  );
}
