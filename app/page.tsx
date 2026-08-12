"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Star,
  Shield,
  Clock,
  ThumbsUp,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

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

const testimonials = [
  {
    name: "Rafiq Islam",
    role: "Customer",
    comment: "FixItNow saved me during an emergency plumbing situation. The technician arrived within 2 hours and fixed everything perfectly!",
    rating: 5,
    location: "Dhaka",
  },
  {
    name: "Nasrin Akter",
    role: "Customer",
    comment: "Very professional service. The electrician was knowledgeable and completed the wiring job safely. Highly recommended!",
    rating: 5,
    location: "Chittagong",
  },
  {
    name: "Kamal Hossain",
    role: "Customer",
    comment: "Booking was super easy and the cleaning team did an amazing job. My apartment looks brand new!",
    rating: 4,
    location: "Sylhet",
  },
];

const categories = [
  { icon: "🔧", name: "Plumbing", count: "120+ experts" },
  { icon: "⚡", name: "Electrical", count: "85+ experts" },
  { icon: "🧹", name: "Cleaning", count: "200+ experts" },
  { icon: "🎨", name: "Painting", count: "95+ experts" },
  { icon: "🪚", name: "Carpentry", count: "60+ experts" },
  { icon: "❄️", name: "HVAC", count: "45+ experts" },
];

const steps = [
  {
    step: "01",
    title: "Browse Services",
    desc: "Search and filter from hundreds of verified home services in your area.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Book a Technician",
    desc: "Choose your preferred technician, pick a time slot, and confirm your booking.",
    icon: "📅",
  },
  {
    step: "03",
    title: "Pay Securely",
    desc: "After the technician accepts, pay safely via Stripe. No upfront payment required.",
    icon: "💳",
  },
  {
    step: "04",
    title: "Job Done",
    desc: "Technician completes the job. Leave a review and help others choose wisely.",
    icon: "✅",
  },
];

const faqs = [
  {
    q: "How do I book a service?",
    a: "Browse services, click on a technician's profile, select your service and time slot, then submit your booking request.",
  },
  {
    q: "When do I pay?",
    a: "You only pay after the technician accepts your booking. Payment is processed securely via Stripe.",
  },
  {
    q: "Can I cancel a booking?",
    a: "Yes — you can cancel any booking before it reaches IN_PROGRESS status. Cancellations after acceptance may be subject to review.",
  },
  {
    q: "How are technicians verified?",
    a: "All technicians go through a profile review process and are rated by real customers after each completed job.",
  },
  {
    q: "What if I'm not satisfied?",
    a: "Contact our support team. We take quality seriously and will work to resolve any issues with your service.",
  },
];

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          observer.disconnect();
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

      {/* ── SECTION 1: HERO ── */}
      <section className="relative bg-gray-900 text-white min-h-[65vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center max-w-3xl mx-auto">
          <span className="inline-block bg-blue-600/20 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6">
            🔧 Bangladeshs #1 Home Service Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Trusted{" "}
            <span className="text-blue-400">Home Service</span>{" "}
            Platform
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Connect with verified technicians for plumbing, electrical, cleaning,
            painting and more — right at your doorstep.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/services">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 gap-2">
                Browse Services <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gray-800 border border-gray-600 hover:bg-black transition-colors"
              >
                Get Started Free
              </Button>
            </Link>
          </div>
          <div className="flex gap-6 justify-center mt-8 text-sm text-gray-400 flex-wrap">
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400" /> No upfront payment</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400" /> Verified technicians</span>
            <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-400" /> Stripe secured</span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STATS ── */}
      <section ref={statsRef} className="bg-blue-600 text-white py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: customerCount, suffix: "+", label: "Happy Customers" },
            { value: technicianCount, suffix: "+", label: "Verified Technicians" },
            { value: bookingCount, suffix: "+", label: "Jobs Completed" },
            { value: ratingCount, suffix: "%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl md:text-5xl font-bold">
                {stat.value.toLocaleString()}{stat.suffix}
              </p>
              <p className="text-blue-100 mt-2 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: SERVICE CATEGORIES ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">Browse by Category</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Find the right professional for every home need
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link href="/services" key={cat.name}>
                <Card className="hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group h-full">
                  <CardContent className="pt-6 pb-4 text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <p className="font-semibold text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{cat.count}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: HOW IT WORKS ── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Get your home service done in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.step} className="relative text-center">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  {step.icon}
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                  Step {step.step}
                </span>
                <h3 className="font-bold mt-1 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{step.desc}</p>
                {i < steps.length - 1 && (
                  <ChevronRight className="hidden md:block absolute top-7 -right-3 h-5 w-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: WHY FIXITNOW ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose FixItNow?</h2>
            <p className="text-gray-500 dark:text-gray-400">
              We make home services simple, safe, and reliable
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="h-7 w-7" />, title: "Verified Technicians", desc: "Every technician is background-checked and reviewed by real customers." },
              { icon: <Clock className="h-7 w-7" />, title: "Fast Response", desc: "Book in minutes. Most technicians respond within hours." },
              { icon: <Star className="h-7 w-7" />, title: "Quality Guaranteed", desc: "Rate your experience. We only keep top-rated professionals." },
              { icon: <ThumbsUp className="h-7 w-7" />, title: "Secure Payment", desc: "Pay only after acceptance via Stripe. Your money is always safe." },
            ].map((feature) => (
              <Card key={feature.title} className="text-center h-full">
                <CardContent className="pt-6">
                  <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TESTIMONIALS ── */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What Customers Say</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Real reviews from real customers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="h-full">
                <CardContent className="pt-6">
                  <div className="flex gap-1 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 italic">
                    &quot;{t.comment}&quot;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {t.location}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FAQ ── */}
      <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Frequently Asked Questions</h2>
            <p className="text-gray-500 dark:text-gray-400">
              Everything you need to know about FixItNow
            </p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex justify-between items-center px-5 py-4 text-left font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronRight
                    className={`h-4 w-4 text-gray-400 transition-transform ${
                      openFaq === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: CTA ── */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">
            Ready to fix something today?
          </h2>
          <p className="text-blue-100 mb-8">
            Join 1,200+ customers who trust FixItNow for all their home service needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/auth/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Register as Customer
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-700 border border-blue-500 hover:bg-blue-800">
                Join as Technician
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-3">
              🔧 FixItNow
            </div>
            <p className="text-sm">Bangladeshs trusted home service platform connecting customers with verified professionals.</p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Quick Links</p>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block hover:text-white transition-colors">Home</Link>
              <Link href="/services" className="block hover:text-white transition-colors">Services</Link>
              <Link href="/about" className="block hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="block hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Account</p>
            <div className="space-y-2 text-sm">
              <Link href="/auth/login" className="block hover:text-white transition-colors">Login</Link>
              <Link href="/auth/register" className="block hover:text-white transition-colors">Register</Link>
              <Link href="/auth/dashboard/customer" className="block hover:text-white transition-colors">Customer Dashboard</Link>
              <Link href="/auth/dashboard/technician" className="block hover:text-white transition-colors">Technician Dashboard</Link>
            </div>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">Contact</p>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@fixitnow.com</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> +880 1700-000000</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© 2026 FixItNow. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}