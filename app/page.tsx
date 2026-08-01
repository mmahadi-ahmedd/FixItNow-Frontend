
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Counter hook — counts up from 0 to target when element is visible
function useCountUp(target: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);

  return count;
}

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  // Trigger counter when stats section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect(); // only trigger once
        }
      },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const customerCount = useCountUp(1200, 2000, statsVisible);
  const technicianCount = useCountUp(350, 2000, statsVisible);
  const bookingCount = useCountUp(4800, 2000, statsVisible);
  const ratingCount = useCountUp(98, 2000, statsVisible);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
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
            <Button
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-200"
            >
              Browse Services
            </Button>
          </Link>
          <Link href="/auth/register">
            <Button
              size="lg"
              className="bg-gray-900 text-white border border-gray-600 hover:bg-black transition-colors"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
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

      {/* Stats Section — animated counters */}
      <section
        ref={statsRef}
        className="bg-gray-900 text-white py-16 px-4"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">
            Trusted by thousands across Bangladesh
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white">
                {customerCount.toLocaleString()}+
              </p>
              <p className="text-gray-400 mt-2 text-sm">Happy Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                {technicianCount.toLocaleString()}+
              </p>
              <p className="text-gray-400 mt-2 text-sm">Verified Technicians</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                {bookingCount.toLocaleString()}+
              </p>
              <p className="text-gray-400 mt-2 text-sm">Jobs Completed</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                {ratingCount}%
              </p>
              <p className="text-gray-400 mt-2 text-sm">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4 text-center text-sm">
        <p>© 2026 FixItNow. All rights reserved.</p>
        <div className="flex gap-4 justify-center mt-2">
          <Link href="/services" className="hover:text-white">
            Services
          </Link>
          <Link href="/auth/login" className="hover:text-white">
            Login
          </Link>
          <Link href="/auth/register" className="hover:text-white">
            Register
          </Link>
        </div>
      </footer>
    </main>
  );
}