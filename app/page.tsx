import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="bg-gray-900 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Your Trusted Home Service Platform
        </h1>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          Connect with verified technicians for plumbing, electrical, cleaning,
          painting and more — right at your doorstep.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/services">
            <Button size="lg">Browse Services</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      <section className="py-16 px-4 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">
          Why FixItNow?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: "🔧",
              title: "Verified Technicians",
              desc: "All technicians are vetted and rated by real customers.",
            },
            {
              icon: "📅",
              title: "Easy Booking",
              desc: "Book a service in minutes and track your job in real time.",
            },
            {
              icon: "💳",
              title: "Secure Payments",
              desc: "Pay safely via Stripe after your booking is accepted.",
            },
          ].map((feature) => (
            <Card key={feature.title}>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-500 mb-6">
          Join thousands of customers who trust FixItNow.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/auth/register">
            <Button size="lg">Register as Customer</Button>
          </Link>
          <Link href="/auth/register">
            <Button size="lg" variant="outline">
              Join as Technician
            </Button>
          </Link>
        </div>
      </section>

      
    </main>
  );
}