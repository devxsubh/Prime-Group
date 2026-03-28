import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  return (
    <div className="container max-w-md mx-auto py-16 px-4">
      <Card className="rounded-xl border text-center" style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}>
        <CardHeader>
          <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: "rgba(34, 197, 94, 0.15)" }}>
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <CardTitle className="font-playfair-display" style={{ color: "var(--primary-blue)" }}>
            Payment successful
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="font-montserrat text-gray-600">
            Your credits have been added to your account. You can use them to unlock contacts.
          </p>
          <Button asChild className="rounded-xl font-montserrat w-full" style={{ backgroundColor: "var(--primary-blue)" }}>
            <Link href="/discover">Continue to Discover</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl font-montserrat w-full">
            <Link href="/profile">My profile</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
