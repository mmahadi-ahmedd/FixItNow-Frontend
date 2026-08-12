import {
    Mail,
    Phone,
    MapPin,
    Clock,
    Send,
} from "lucide-react";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">

            {/* Hero Section */}
            <section className="bg-gray-900 px-6 py-20 text-white">
                <div className="mx-auto max-w-4xl text-center">

                    <p className="text-sm font-semibold uppercase tracking-widest text-blue-400">
                        Contact Us
                    </p>

                    <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                        How can we help?
                    </h1>

                    <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-gray-300">
                        Have a question about our services or need help with
                        your repair request? Our team is here to help.
                    </p>

                </div>
            </section>

            {/* Contact Section */}
            <section className="px-6 py-20">
                <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-3">

                    {/* Contact Information */}
                    <div className="lg:col-span-1">

                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                            Get In Touch
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Contact FixItNow
                        </h2>

                        <p className="mt-4 leading-7 text-gray-600">
                            Whether you need information about a service,
                            assistance with your account, or help with an
                            existing request, feel free to contact us.
                        </p>

                        <div className="mt-8 space-y-6">

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Mail size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Email
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        support@fixitnow.com
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Phone size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Phone
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        +880 1234-567890
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <MapPin size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Office
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Dhaka, Bangladesh
                                    </p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-start gap-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                    <Clock size={20} />
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        Support Hours
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-600">
                                        Saturday – Thursday
                                    </p>

                                    <p className="text-sm text-gray-600">
                                        9:00 AM – 6:00 PM
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">

                        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">

                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    Send us a message
                                </h2>

                                <p className="mt-2 text-sm text-gray-600">
                                    Fill out the form below and our support
                                    team will get back to you.
                                </p>
                            </div>

                            <form className="space-y-6">

                                {/* Name + Email */}
                                <div className="grid gap-6 sm:grid-cols-2">

                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="mb-2 block text-sm font-medium text-gray-900"
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="Enter your name"
                                            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="mb-2 block text-sm font-medium text-gray-900"
                                        >
                                            Email Address
                                        </label>

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        />
                                    </div>

                                </div>

                                {/* Subject */}
                                <div>
                                    <label
                                        htmlFor="subject"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Subject
                                    </label>

                                    <input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        placeholder="What can we help you with?"
                                        className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="mb-2 block text-sm font-medium text-gray-900"
                                    >
                                        Message
                                    </label>

                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        placeholder="Write your message..."
                                        className="w-full resize-none rounded-lg border px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 sm:w-auto"
                                >
                                    <Send size={17} />
                                    Send Message
                                </button>

                            </form>
                        </div>
                    </div>

                </div>
            </section>

            {/* FAQ */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="mx-auto max-w-4xl">

                    <div className="text-center">
                        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
                            FAQ
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            Frequently asked questions
                        </h2>
                    </div>

                    <div className="mt-10 space-y-4">

                        <details className="rounded-xl border bg-white p-5">
                            <summary className="cursor-pointer font-semibold text-gray-900">
                                How do I find a technician?
                            </summary>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Browse our available services and choose the
                                service that matches your repair needs.
                            </p>
                        </details>

                        <details className="rounded-xl border bg-white p-5">
                            <summary className="cursor-pointer font-semibold text-gray-900">
                                Can I request a specific service?
                            </summary>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                Yes. You can explore the available services and
                                submit a request based on your requirements.
                            </p>
                        </details>

                        <details className="rounded-xl border bg-white p-5">
                            <summary className="cursor-pointer font-semibold text-gray-900">
                                How can I contact support?
                            </summary>

                            <p className="mt-3 text-sm leading-6 text-gray-600">
                                You can use the contact form above or reach us
                                directly through our support email.
                            </p>
                        </details>

                    </div>
                </div>
            </section>

        </main>
    );
}