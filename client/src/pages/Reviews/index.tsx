import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitReview } from '@/utils/api';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import Button from '@/components/ui/Button';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';
import { HiOutlineStar, HiOutlineCheckCircle } from 'react-icons/hi2';


export default function Reviews() {
  const ref = useGsapFadeIn();

  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    role: '',
    company: '',
    avatar: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const form = new FormData();
      form.append('quote', formData.quote);
      form.append('author', formData.author);
      form.append('role', formData.role);
      form.append('company', formData.company);
      form.append('avatar', formData.avatar || formData.author?.charAt(0).toUpperCase() || '?');
      if (imageFile) form.append('image', imageFile);
      return submitReview(form);
    },
    onSuccess: () => {
      setFormData({
        quote: '',
        author: '',
        role: '',
        company: '',
        avatar: '',
      });
      setImageFile(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.quote.trim() || !formData.author.trim() || !formData.role.trim()) {
      return;
    }
    mutation.mutate();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Helmet>
        <title>Submit Your Testimonial — TCON Solutions</title>
        <meta name="description" content="Share your experience with TCON Solutions. We'd love to hear from you!" />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Share Your Experience
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Leave Us a <AuroraTextEffect text="Testimonial" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            Your feedback helps us improve and inspires other clients to work with us. Share your experience with TCON Solutions today.
          </p>
        </div>
      </section>

      {/* Testimonial Form */}
      <section className="py-20">
        <div ref={ref} className="container-custom">
          <div className="max-w-3xl mx-auto">
            {mutation.isSuccess ? (
              <div className="glass-strong rounded-3xl p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <HiOutlineCheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
                <h2 className="text-2xl font-bold text-text-heading mb-3">Testimonial Submitted!</h2>
                <p className="text-text-body mb-8 max-w-md mx-auto">
                  Thank you for sharing your experience with us. Your testimonial helps other clients learn about our services and inspires our team to continue delivering excellence.
                </p>
                <Button onClick={() => mutation.reset()}>
                  Submit Another Testimonial
                </Button>
              </div>
            ) : (
              <div className="glass-strong rounded-3xl p-8 md:p-10">
                <h2 className="text-2xl font-bold text-text-heading mb-2">Your Testimonial Matters</h2>
                <p className="text-text-body mb-8">
                  Tell us about your experience working with TCON Solutions. Your feedback is valuable to us and our community.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Quote */}
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      Your Testimonial *
                    </label>
                    <textarea
                      name="quote"
                      value={formData.quote}
                      onChange={handleChange}
                      placeholder="Share your experience with us. What did we do well? What was memorable?"
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors resize-none"
                    />
                  </div>

                  {/* Name and Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-2">
                        Your Role *
                      </label>
                      <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="e.g. CEO, Founder, Director"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Company and Avatar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-2">
                        Company / Business Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Tcon Solutions Pvt Ltd"
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-heading mb-2">
                        Avatar (Single Character)
                      </label>
                      <input
                        type="text"
                        name="avatar"
                        value={formData.avatar}
                        onChange={(e) => {
                          let value = e.target.value.toUpperCase();
                          if (value.length > 1) value = value.charAt(0);
                          handleChange({ ...e, target: { ...e.target, value } });
                        }}
                        placeholder={formData.author ? formData.author.charAt(0).toUpperCase() : 'J'}
                        maxLength={1}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors uppercase text-center text-lg font-semibold"
                      />
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-text-heading mb-2">
                      Profile Image (Optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-indigo/10 file:text-accent-indigo file:cursor-pointer hover:file:bg-accent-indigo/20 transition-colors"
                    />
                    {imageFile && (
                      <p className="mt-2 text-xs text-emerald-400">✓ {imageFile.name}</p>
                    )}
                  </div>

                  {/* Submission Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <HiOutlineStar className="w-4 h-4" />
                      Your testimonial will be featured on our website
                    </div>
                    <Button
                      disabled={mutation.isPending}
                      onClick={handleSubmit}
                    >
                      {mutation.isPending ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
