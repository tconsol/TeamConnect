import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitContact } from '@/utils/api';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import Button from '@/components/ui/Button';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import {
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineMapPin,
} from 'react-icons/hi2';

const contactInfo = [
  { icon: HiOutlineEnvelope, label: 'Email', value: 'hello@tconsolutions.com' },
  { icon: HiOutlinePhone, label: 'Phone', value: '+1 (555) 123-4567' },
  { icon: HiOutlineMapPin, label: 'Office', value: '123 Innovation Drive, Tech City' },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', company: '', subject: '', service: '', budget: '', message: '',
  });
  const ref = useGsapFadeIn();

  const mutation = useMutation({
    mutationFn: submitContact,
    onSuccess: () => {
      setFormData({ name: '', email: '', phone: '', company: '', subject: '', service: '', budget: '', message: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <>
      <Helmet>
        <title>Contact — TCON Solutions</title>
        <meta name="description" content="Get in touch with TCON Solutions. Let's discuss your next digital project." />
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
            Have a project in mind? We'd love to hear about it. Get in touch and let's create something amazing together.
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
                <div key={info.label} className="glass rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-indigo/10 flex items-center justify-center shrink-0">
                    <info.icon className="w-6 h-6 text-accent-indigo" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-heading">{info.label}</h3>
                    <p className="text-text-body text-sm mt-1">{info.value}</p>
                  </div>
                </div>
              ))}

              <div className="glass rounded-2xl p-6">
                <h3 className="text-sm font-semibold text-text-heading mb-3">Business Hours</h3>
                <p className="text-text-body text-sm">Monday - Friday: 9:00 AM - 6:00 PM EST</p>
                <p className="text-text-body text-sm">Weekend: By appointment</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="glass-strong rounded-3xl p-8 md:p-10">
                {mutation.isSuccess ? (
                  <div className="text-center py-12">
                    <span className="text-5xl">✉️</span>
                    <h2 className="text-2xl font-bold text-text-heading mt-6">Message Sent!</h2>
                    <p className="text-text-body mt-3 max-w-md mx-auto">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button className="mt-6" onClick={() => mutation.reset()}>
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Name *</label>
                        <input
                          name="name" value={formData.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Email *</label>
                        <input
                          name="email" type="email" value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="john@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Phone</label>
                        <input
                          name="phone" value={formData.phone} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Company</label>
                        <input
                          name="company" value={formData.company} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                          placeholder="Company name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-sub mb-2">Subject *</label>
                      <input
                        name="subject" value={formData.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                        placeholder="New project inquiry"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Service Interested In</label>
                        <select
                          name="service" value={formData.service} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white focus:outline-none focus:border-accent-indigo/50 transition-colors"
                        >
                          <option value="" className="bg-bg-secondary">Select a service</option>
                          <option value="web" className="bg-bg-secondary">Web Development</option>
                          <option value="mobile" className="bg-bg-secondary">Mobile Development</option>
                          <option value="cloud" className="bg-bg-secondary">Cloud & DevOps</option>
                          <option value="design" className="bg-bg-secondary">UI/UX Design</option>
                          <option value="ai" className="bg-bg-secondary">AI & ML</option>
                          <option value="other" className="bg-bg-secondary">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-text-sub mb-2">Budget Range</label>
                        <select
                          name="budget" value={formData.budget} onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white focus:outline-none focus:border-accent-indigo/50 transition-colors"
                        >
                          <option value="" className="bg-bg-secondary">Select budget</option>
                          <option value="<10k" className="bg-bg-secondary">Under $10,000</option>
                          <option value="10k-25k" className="bg-bg-secondary">$10,000 - $25,000</option>
                          <option value="25k-50k" className="bg-bg-secondary">$25,000 - $50,000</option>
                          <option value="50k-100k" className="bg-bg-secondary">$50,000 - $100,000</option>
                          <option value=">100k" className="bg-bg-secondary">$100,000+</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm text-text-sub mb-2">Message *</label>
                      <textarea
                        name="message" value={formData.message} onChange={handleChange} required rows={5}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors resize-none"
                        placeholder="Tell us about your project..."
                      />
                    </div>

                    {mutation.isError && (
                      <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
