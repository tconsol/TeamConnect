import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs, submitApplication } from '@/utils/api';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { PageSkeleton } from '@/components/ui/Skeleton';
import Button from '@/components/ui/Button';
import {
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineXMark,
} from 'react-icons/hi2';

const fallbackJobs = [
  { _id: '1', title: 'Senior Full-Stack Developer', department: 'Engineering', location: 'Remote', type: 'full-time', experience: '5+ years', description: 'Join our engineering team to build cutting-edge web applications.', requirements: ['React/Next.js', 'Node.js', 'PostgreSQL', 'AWS'], isActive: true },
  { _id: '2', title: 'UI/UX Designer', department: 'Design', location: 'New York, NY', type: 'full-time', experience: '3+ years', description: 'Create stunning user interfaces and experiences for our clients.', requirements: ['Figma', 'User Research', 'Design Systems', 'Prototyping'], isActive: true },
  { _id: '3', title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'full-time', experience: '4+ years', description: 'Build and maintain our cloud infrastructure and CI/CD pipelines.', requirements: ['AWS/GCP', 'Docker', 'Kubernetes', 'Terraform'], isActive: true },
];

export default function Careers() {
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [applying, setApplying] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    placeholderData: fallbackJobs,
  });

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedJob) return;

    setApplying(true);
    try {
      const formData = new FormData(e.currentTarget);
      await submitApplication(selectedJob._id, formData);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <Helmet>
        <title>Careers — TCON Solutions</title>
        <meta name="description" content="Join our team of innovators. Explore open positions at TCON Solutions." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-indigo opacity-20" />
        <div className="container-custom relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full glass text-xs font-semibold uppercase tracking-[0.2em] text-accent-indigo mb-6">
            Careers
          </span>
          <h1 className="text-hero font-bold text-text-heading leading-tight mb-6">
            Join Our <span className="gradient-text">Team</span>
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            We're always looking for talented people who share our passion for building extraordinary digital experiences.
          </p>
        </div>
      </section>

      {/* Perks */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: '🌍', title: 'Remote-First', desc: 'Work from anywhere in the world' },
              { icon: '📚', title: 'Learning Budget', desc: 'Annual budget for courses & conferences' },
              { icon: '🏥', title: 'Health Benefits', desc: 'Comprehensive health coverage' },
              { icon: '🎯', title: 'Stock Options', desc: 'Equity in a growing company' },
            ].map((perk) => (
              <div key={perk.title} className="glass rounded-2xl p-6 text-center">
                <span className="text-3xl">{perk.icon}</span>
                <h3 className="text-sm font-semibold text-text-heading mt-3">{perk.title}</h3>
                <p className="text-xs text-text-muted mt-1">{perk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-title font-bold text-text-heading mb-10">Open Positions</h2>
          <div ref={ref} className="space-y-4">
            {(jobs || fallbackJobs).map((job: any) => (
              <div
                key={job._id}
                className="glass rounded-2xl p-6 md:p-8 hover:bg-white/[0.08] transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedJob(job)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-text-heading group-hover:gradient-text transition-all">
                      {job.title}
                    </h3>
                    <p className="text-text-body text-sm mt-1">{job.department}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <HiOutlineMapPin className="w-4 h-4" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <HiOutlineBriefcase className="w-4 h-4" /> {job.type}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-text-muted">
                      <HiOutlineClock className="w-4 h-4" /> {job.experience}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {(jobs || fallbackJobs).length === 0 && (
            <div className="text-center py-20 glass rounded-2xl">
              <p className="text-text-muted text-lg">No open positions at the moment.</p>
              <p className="text-text-muted text-sm mt-2">Check back soon or send us your resume!</p>
            </div>
          )}
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setSelectedJob(null); setSubmitStatus('idle'); }} />
          <div className="relative glass-strong rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <button
              onClick={() => { setSelectedJob(null); setSubmitStatus('idle'); }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-text-muted hover:text-white transition-colors"
            >
              <HiOutlineXMark className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-text-heading mb-2">{selectedJob.title}</h2>
            <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
              <span>{selectedJob.department}</span>
              <span>•</span>
              <span>{selectedJob.location}</span>
              <span>•</span>
              <span>{selectedJob.type}</span>
            </div>

            <p className="text-text-body leading-relaxed mb-6">{selectedJob.description}</p>

            {selectedJob.requirements?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-text-heading uppercase tracking-wider mb-3">Requirements</h3>
                <ul className="space-y-2">
                  {selectedJob.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-text-body text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-indigo mt-1.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="border-t border-white/[0.06] pt-6 mt-6">
              {submitStatus === 'success' ? (
                <div className="text-center py-8">
                  <span className="text-4xl">🎉</span>
                  <h3 className="text-xl font-semibold text-text-heading mt-4">Application Submitted!</h3>
                  <p className="text-text-body mt-2">We'll review your application and get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <h3 className="text-lg font-semibold text-text-heading mb-4">Apply Now</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="name" required placeholder="Full Name" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors" />
                    <input name="email" type="email" required placeholder="Email Address" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors" />
                  </div>
                  <input name="phone" placeholder="Phone Number" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors" />
                  <input name="linkedIn" placeholder="LinkedIn Profile URL" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors" />
                  <div>
                    <label className="block text-sm text-text-sub mb-2">Resume (PDF, DOC, DOCX)</label>
                    <input name="resume" type="file" required accept=".pdf,.doc,.docx" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-accent-indigo/20 file:text-accent-indigo" />
                  </div>
                  <textarea name="coverLetter" rows={4} placeholder="Cover Letter (optional)" className="w-full px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder:text-text-muted focus:outline-none focus:border-accent-indigo/50 transition-colors resize-none" />
                  {submitStatus === 'error' && (
                    <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
                  )}
                  <Button type="submit" disabled={applying} className="w-full">
                    {applying ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
