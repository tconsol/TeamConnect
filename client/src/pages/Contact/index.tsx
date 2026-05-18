import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { useState, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cmsQueryOptions } from "@/utils/cmsQueryOptions";
import { submitContact } from "@/utils/api";
import { useGsapFadeIn } from "@/hooks/useAnimations";
import Button from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { AuroraTextEffect } from "@/components/ui/AuroraTextEffect";
import { getCanonicalUrl, breadcrumbJsonLd } from "@/utils/seo";
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";

export default function Contact() {
  const location = useLocation();
  const canonicalUrl = getCanonicalUrl(location.pathname);

  const { data: cms } = useQuery(cmsQueryOptions("contact"));
  const content = cms?.content as Record<string, string> | undefined;

  const breadcrumbs = [
    { name: "Home", url: "https://tconsolutions.com" },
    { name: "Contact", url: canonicalUrl },
  ];

  const contactInfo = [
    {
      icon: HiOutlineEnvelope,
      label: "Email",
      value: content?.email || "info@tconsolutions.com",
    },
    {
      icon: HiOutlinePhone,
      label: "Phone",
      value: content?.phone || "+91 949 283 6371",
    },
    {
      icon: HiOutlineMapPin,
      label: "Office",
      value: content?.address || "123 Innovation Drive, Tech City",
    },
  ];

  const [mapActive, setMapActive] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    service: "",
    budget: "",
    message: "",
  });
  const ref = useGsapFadeIn();

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        service: "",
        budget: "",
        message: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Helmet>
        <title>Contact TCON Solutions</title>
        <meta
          name="description"
          content="Get in touch with TCON Solutions. Let's discuss your next digital project or business needs."
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Contact TCON Solutions" />
        <meta
          property="og:description"
          content="Get in touch with our team. Let's discuss your next project."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:image"
          content="https://tconsolutions.com/og-contact.png"
        />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact TCON Solutions" />
        <meta
          name="twitter:description"
          content="Reach out to our team for your next project."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbJsonLd(breadcrumbs))}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Contact Us
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Let's <AuroraTextEffect text="Connect" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Have a project in mind? We'd love to hear about it. Get in touch and
            let's create something amazing together.
          </p>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20">
        <div ref={ref} className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Info */}
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <div
                  key={info.label}
                  className="glass rounded-2xl p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-6 h-6 text-accent-indigo" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-text-heading">
                      {info.label}
                    </h3>
                    <p className="text-text-body text-sm mt-1 break-all">
                      {info.value}
                    </p>
                  </div>
                </div>
              ))}

              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-text-heading mb-3">
                  Business Hours
                </h3>
                <p className="text-text-body text-sm">
                  {content?.businessHours ||
                    "Monday - Friday: 9:00 AM - 6:00 PM"}
                </p>
                <p className="text-text-body text-sm">
                  {content?.weekendHours || "Weekend: By appointment"}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glass-strong rounded-3xl p-8 md:p-10">
                {mutation.isSuccess ? (
                  <div className="text-center py-12">
                    <span className="text-5xl">✉️</span>
                    <h2 className="text-2xl font-bold text-text-heading mt-6">
                      Message Sent!
                    </h2>
                    <p className="text-text-body mt-3 max-w-md mx-auto">
                      Thank you for reaching out. We'll get back to you within
                      24 hours.
                    </p>
                    <Button className="mt-6" onClick={() => mutation.reset()}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Name *
                        </label>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Email *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Phone
                        </label>
                        <input
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Company
                        </label>
                        <input
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-sub mb-2">
                        Subject *
                      </label>
                      <input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                        placeholder="New project inquiry"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Service Interested In
                        </label>
                        <Dropdown
                          value={formData.service}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, service: value }))
                          }
                          options={[
                            { value: "", label: "Select a service" },
                            { value: "web", label: "Web Development" },
                            { value: "mobile", label: "Mobile Development" },
                            { value: "cloud", label: "Cloud & DevOps" },
                            { value: "design", label: "UI/UX Design" },
                            { value: "ai", label: "AI & ML" },
                            { value: "other", label: "Other" },
                          ]}
                          placeholder="Select a service"
                          name="service"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">
                          Budget Range
                        </label>
                        <Dropdown
                          value={formData.budget}
                          onChange={(value) =>
                            setFormData((prev) => ({ ...prev, budget: value }))
                          }
                          options={[
                            { value: "", label: "Select budget" },
                            { value: "<10k", label: "Under $10,000" },
                            { value: "10k-25k", label: "$10,000 - $25,000" },
                            { value: "25k-50k", label: "$25,000 - $50,000" },
                            { value: "50k-100k", label: "$50,000 - $100,000" },
                            { value: ">100k", label: "$100,000+" },
                          ]}
                          placeholder="Select budget"
                          name="budget"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-sub mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {mutation.isError && (
                      <p className="text-red-400 text-sm">
                        Something went wrong. Please try again.
                      </p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={mutation.isPending}
                    >
                      {mutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="pb-24">
        <div className="container-custom">
          <div className="glass rounded-3xl overflow-hidden border border-white/[0.08]">
            {/* Map header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-indigo/10 flex items-center justify-center shrink-0">
                  <HiOutlineMapPin className="w-5 h-5 text-accent-indigo" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-heading">
                    Our Location
                  </p>
                  <p className="text-xs text-text-muted">
                    VT Plaza, 3rd Floor, KPHB, Kukatpally, Telangana 500072
                  </p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/tconkphb"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-semibold text-accent-indigo hover:text-accent-blue transition-colors"
              >
                Open in Maps
                <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Map — pointer events blocked until user clicks to prevent scroll/cursor lag */}
            <div
              ref={mapRef}
              className="relative w-full h-[400px] md:h-[480px]"
              onClick={() => setMapActive(true)}
              onMouseLeave={() => setMapActive(false)}
            >
              {/* Click-to-activate overlay — blocks iframe from hijacking cursor/scroll */}
              {!mapActive && (
                <div className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer group">
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-black/60 border border-white/10 text-white text-xs font-semibold backdrop-blur-sm group-hover:bg-accent-indigo/80 transition-all duration-200">
                    <HiOutlineMapPin className="w-4 h-4" />
                    Click to interact with map
                  </div>
                </div>
              )}
              <iframe
                title="TCON Solutions — KPHB, Kukatpally, Telangana"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3805.4144533899416!2d78.39752167487106!3d17.487718199907622!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb9138335c2d59%3A0xb3cbbbb92f391bd6!2sTcon%20Solutions!5e0!3m2!1sen!2sin!4v1778588769578!5m2!1sen!2sin"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full border-0"
                style={{
                  pointerEvents: mapActive ? "auto" : "none",
                  filter: "grayscale(40%) brightness(0.9) contrast(1.05)",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
