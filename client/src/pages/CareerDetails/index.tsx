import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchJobById, submitApplication } from '@/utils/api';
import { PageSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import {
  HiArrowLeft,
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

export default function CareerDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', id],
    queryFn: () => fetchJobById(id!),
    enabled: !!id,
  });

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!job) return;
    setApplying(true);
    try {
      const formData = new FormData(e.currentTarget);
      await submitApplication(job._id, formData);
      setSubmitStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setSubmitStatus('error');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <PageSkeleton />;

  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-text-heading mb-4">Position Not Found</h2>
          <p className="text-text-body mb-8">This job listing may have been removed or the link is invalid.</p>
          <Link to="/careers" className="text-accent-violet hover:text-accent-blue transition-colors">
            ← Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          className="text-center max-w-lg px-6"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(59,130,246,0.15))', border: '1px solid rgba(139,92,246,0.4)' }}>
            <HiOutlineCheckCircle className="w-10 h-10 text-accent-violet" />
          </div>
          <h2 className="text-3xl font-bold text-text-heading mb-3">Application Submitted!</h2>
          <p className="text-text-body mb-8">
            Thanks for applying to <span className="text-white font-medium">{job.title}</span>. We'll review your application and get back to you soon.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/careers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white/60 hover:text-white border border-white/[0.08] hover:border-white/20 transition-all">
              <HiArrowLeft className="w-4 h-4" /> Back to Careers
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{job.title} — TCON Solutions Careers</title>
        <meta name="description" content={`Apply for ${job.title} at TCON Solutions. ${job.department} role.`} />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-36 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-15" />
        <div className="absolute inset-0 dot-pattern opacity-20" />
        <div className="container-custom relative z-10">
          <Link to="/careers" className="inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors mb-8 text-sm">
            <HiArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="text-xs font-semibold text-accent-violet uppercase tracking-widest mb-3 block">
              {job.department}
            </span>
            <h1 className="text-display font-bold text-text-heading mb-6 leading-tight">{job.title}</h1>

            <div className="flex flex-wrap gap-4 mb-8">
              <span className="flex items-center gap-1.5 text-sm text-text-muted bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.06]">
                <HiOutlineMapPin className="w-4 h-4 text-accent-violet" /> {job.location}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-text-muted bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.06]">
                <HiOutlineBriefcase className="w-4 h-4 text-accent-blue" /> {job.type}
              </span>
              {job.experience && (
                <span className="flex items-center gap-1.5 text-sm text-text-muted bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.06]">
                  <HiOutlineClock className="w-4 h-4 text-accent-cyan" /> {job.experience}
                </span>
              )}
              {(job.salaryRange?.min || job.salaryRange?.max) && (
                <span className="flex items-center gap-1.5 text-sm text-text-muted bg-white/[0.05] px-3 py-1.5 rounded-full border border-white/[0.06]">
                  <HiOutlineCurrencyRupee className="w-4 h-4 text-emerald-400" />
                  {job.salaryRange?.min ? `₹${Number(job.salaryRange.min).toLocaleString('en-IN')}` : ''}
                  {job.salaryRange?.min && job.salaryRange?.max ? ' – ' : ''}
                  {job.salaryRange?.max ? `₹${Number(job.salaryRange.max).toLocaleString('en-IN')}` : ''} / annum
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* --- Left: Job details --- */}
            <div className="lg:col-span-2 space-y-10">
              {job.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.06]">About this Role</h2>
                  <p className="text-text-body leading-relaxed">{job.description}</p>
                </motion.div>
              )}

              {job.requirements?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}>
                  <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.06]">Requirements</h2>
                  <ul className="space-y-2.5">
                    {job.requirements.map((req: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-text-body text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-violet mt-2 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {job.responsibilities?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                  <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.06]">Responsibilities</h2>
                  <ul className="space-y-2.5">
                    {job.responsibilities.map((resp: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-text-body text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 shrink-0" />
                        {resp}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {job.benefits?.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}>
                  <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.06]">Benefits</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map((b: string) => (
                      <span key={b} className="tag">{b}</span>
                    ))}
                  </div>
                </motion.div>
              )}

              {job.techStack && Object.values(job.techStack).some((arr: any) => arr?.length > 0) && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                  <h2 className="text-lg font-semibold text-white mb-4 pb-2 border-b border-white/[0.06]">Tech Stack</h2>
                  <div className="space-y-3">
                    {[
                      { key: 'frontend',   label: 'Frontend',   bg: 'rgba(59,130,246,0.15)',  text: '#60a5fa' },
                      { key: 'backend',    label: 'Backend',    bg: 'rgba(16,185,129,0.15)',  text: '#34d399' },
                      { key: 'databases',  label: 'Databases',  bg: 'rgba(245,158,11,0.15)',  text: '#fbbf24' },
                      { key: 'frameworks', label: 'Frameworks', bg: 'rgba(139,92,246,0.15)', text: '#a78bfa' },
                      { key: 'devTools',   label: 'Dev Tools',  bg: 'rgba(236,72,153,0.15)',  text: '#f472b6' },
                    ].map(({ key, label, bg, text }) => {
                      const items: string[] = job.techStack?.[key] || [];
                      if (!items.length) return null;
                      return (
                        <div key={key} className="flex items-start gap-3">
                          <span className="text-xs font-medium pt-1 w-20 shrink-0" style={{ color: 'rgba(148,163,184,0.5)' }}>{label}</span>
                          <div className="flex flex-wrap gap-1.5">
                            {items.map((item) => (
                              <span key={item} className="px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: bg, color: text }}>{item}</span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>

            {/* --- Right: Application form --- */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            >
              <div
                className="sticky top-28 rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(139,92,246,0.08) 0%, rgba(8,10,28,0.95) 100%)',
                  border: '1px solid rgba(139,92,246,0.2)',
                }}
              >
                <h2 className="text-xl font-bold text-white mb-6">Apply for this Role</h2>

                <form onSubmit={handleApply} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Full Name <span className="text-accent-violet">*</span></label>
                    <input name="name" required placeholder="John Doe" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Email Address <span className="text-accent-violet">*</span></label>
                    <input name="email" type="email" required placeholder="john@example.com" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Phone Number</label>
                    <input name="phone" placeholder="+91 9999999999" className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Resume <span className="text-accent-violet">*</span></label>
                    <input
                      name="resume"
                      type="file"
                      required
                      accept=".pdf,.doc,.docx"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white text-sm file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-accent-violet/20 file:text-accent-violet hover:file:bg-accent-violet/30 transition-all"
                    />
                    <p className="text-[11px] text-text-muted mt-1">PDF, DOC or DOCX · max 5MB</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1.5">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      rows={4}
                      placeholder="Tell us why you're a great fit…"
                      className="input-field w-full resize-none"
                    />
                  </div>

                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg border border-red-400/20">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <Button type="submit" disabled={applying} className="w-full mt-2">
                    {applying ? 'Submitting…' : 'Submit Application'}
                  </Button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}
