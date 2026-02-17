import ContactForm from "@/components/contact/contact-form";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen py-16 px-4" style={{ backgroundColor: "var(--pure-white)" }}>
      <div className="container mx-auto max-w-xl">
        <div className="text-center mb-12">
          <div className="inline-block px-8 py-4 rounded-full mb-6" style={{ backgroundColor: "var(--primary-blue)" }}>
            <span className="text-lg font-montserrat font-semibold uppercase tracking-wide text-gold-gradient">
              Contact Us
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-playfair-display font-bold mb-4 text-gold-gradient" style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.15)" }}>
            Get in Touch
          </h1>
          <p className="text-lg font-montserrat max-w-md mx-auto" style={{ color: "var(--primary-blue)" }}>
            Have a question or need help? Send us a message and we&apos;ll get back to you shortly.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
