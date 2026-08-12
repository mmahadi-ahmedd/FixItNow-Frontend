import { Wrench, ShieldCheck, Users, Clock } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* Hero */}
            <section className="bg-gray-900 px-6 py-20 text-center text-white">
                <div className="mx-auto max-w-3xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-400">
                        About FixItNow
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Reliable help when you need it most.
                    </h1>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-300">
                        FixItNow connects customers with trusted technicians
                        for fast, reliable, and professional repair services.
                    </p>
                </div>
            </section>

            {/* Introduction */}
            <section className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2 md:items-center">

                    <div>
                        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                            Who We Are
                        </p>

                        <h2 className="text-3xl font-bold text-gray-900">
                            Making repairs simple and stress-free.
                        </h2>

                        <p className="mt-5 leading-7 text-gray-600">
                            FixItNow is a service platform designed to make
                            finding professional repair and maintenance help
                            easier. Customers can explore available services,
                            connect with technicians, and manage their service
                            requests from one place.
                        </p>

                        <p className="mt-4 leading-7 text-gray-600">
                            Our goal is to create a trusted environment where
                            customers can get quality service while technicians
                            can connect with people who need their expertise.
                        </p>
                    </div>

                    <div className="rounded-2xl bg-gray-100 p-10">
                        <Wrench className="h-12 w-12 text-blue-600" />

                        <h3 className="mt-6 text-xl font-semibold text-gray-900">
                            One platform for every repair
                        </h3>

                        <p className="mt-3 leading-7 text-gray-600">
                            From everyday maintenance to professional repairs,
                            FixItNow brings customers and skilled technicians
                            together through one convenient platform.
                        </p>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="mx-auto max-w-6xl">

                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                            Why FixItNow
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Built around trust and convenience
                        </h2>
                    </div>

                    <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                        <div className="rounded-xl border bg-white p-6">
                            <ShieldCheck className="h-9 w-9 text-blue-600" />

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Trusted Service
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Connect with technicians through a reliable
                                service platform.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-6">
                            <Users className="h-9 w-9 text-blue-600" />

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Skilled Technicians
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Find professionals with the skills needed for
                                different types of repairs.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-6">
                            <Clock className="h-9 w-9 text-blue-600" />

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Save Time
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Discover suitable services without spending
                                hours searching manually.
                            </p>
                        </div>

                        <div className="rounded-xl border bg-white p-6">
                            <Wrench className="h-9 w-9 text-blue-600" />

                            <h3 className="mt-5 font-semibold text-gray-900">
                                Easy Repairs
                            </h3>

                            <p className="mt-2 text-sm leading-6 text-gray-600">
                                Manage your repair needs through a simple and
                                convenient platform.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="px-6 py-20 text-center">
                <div className="mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Need a repair?
                    </h2>

                    <p className="mt-4 text-gray-600">
                        Explore available services and find the right
                        technician for your needs.
                    </p>

                    <a
                        href="/services"
                        className="mt-7 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                    >
                        Explore Services
                    </a>
                </div>
            </section>

        </main>
    );
}