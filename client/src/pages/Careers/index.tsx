import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs } from '@/utils/api';
import { cmsQueryOptions } from '@/utils/cmsQueryOptions';
import { useGsapFadeIn } from '@/hooks/useAnimations';
import { PageSkeleton } from '@/components/ui/Skeleton';
import {
  HiOutlineMapPin,
  HiOutlineBriefcase,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiArrowLongRight,
} from 'react-icons/hi2';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';

const perkEmojis = ['🌍', '📚', '🏥', '🎯', '💰', '🏖️', '🚀', '🎮'];

export default function Careers() {
  const ref = useGsapFadeIn({ stagger: 0.1 });

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
  });

  const { data: cms } = useQuery(cmsQueryOptions('careers'));

  const perks = cms?.content?.perks || [];

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <Helmet>
        <title>Careers — TCON Solutions</title>
        <meta
          name="description"
          content="Join our team of innovators. Explore open positions at TCON Solutions."
        />
      </Helmet>

      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-glow-violet opacity-20" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="container-custom relative z-10 text-center">
          <span className="tag mb-6">Careers</span>
          <h1 className="text-hero font-extrabold text-text-heading leading-tight mb-6">
            Join Our{' '}
            <AuroraTextEffect text="Team" />
          </h1>
          <p className="text-subtitle text-text-body max-w-2xl mx-auto leading-relaxed">
            We&apos;re always looking for talented people who share our passion for building
            extraordinary digital experiences.
          </p>
        </div>
      </section>

      {perks.length > 0 && (
        <section className="py-20 border-b border-white/[0.06]">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {perks.map((perk: any, i: number) => (
                <div key={perk.title} className="glass-card rounded-2xl p-6 text-center">
                  <span className="text-3xl">{perkEmojis[i % perkEmojis.length]}</span>
                  <h3 className="text-sm font-semibold text-text-heading mt-3">{perk.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{perk.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-title font-bold text-text-heading mb-10">
            Open{' '}
            <AuroraTextEffect text="Positions" />
          </h2>

          <div ref={ref} className="space-y-4">
            {(jobs as any[]).map((job: any) => (
              <Link
                key={job._id}
                to={`/careers/${job._id}`}
                className="glass-card rounded-2xl p-6 md:p-8 group block"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-text-heading group-hover:gradient-text transition-all">
                      {job.title}
                    </h3>
                    <p className="text-text-body text-sm mt-1">{job.department}</p>

                    {(job.salaryRange?.min || job.salaryRange?.max) && (
                      <div className="mt-3 flex items-center gap-1.5 text-sm text-text-muted">
                        <HiOutlineCurrencyRupee className="w-4 h-4 text-emerald-400" />
                        <span>
                          {job.salaryRange?.min
                            ? `INR ${Number(job.salaryRange.min).toLocaleString('en-IN')} - ${job.salaryRange?.max ? `INR ${Number(job.salaryRange.max).toLocaleString('en-IN')}` : 'Open'} / annum`
                            : job.salaryRange?.max
                            ? `Up to INR ${Number(job.salaryRange.max).toLocaleString('en-IN')} / annum`
                            : null}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col md:items-end gap-4">
                    <div className="flex flex-wrap md:justify-end items-center gap-4">
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

                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-violet group-hover:text-accent-blue transition-colors">
                      View Details & Apply
                      <HiArrowLongRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {(jobs as any[]).length === 0 && (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-text-muted text-lg">No open positions at the moment.</p>
              <p className="text-text-muted text-sm mt-2">Check back soon or send us your resume!</p>
            </div>
          )}
        </div>
      </section>

      {(jobs as any[]).length > 0 && (
        <section className="pb-20">
          <div className="container-custom">
            <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
              <div>
                <h3 className="text-lg font-semibold text-text-heading">Found a role that matches you?</h3>
                <p className="text-text-muted text-sm mt-1">
                  Open any position to see full details and submit your application.
                </p>
              </div>
              <Link
                to={`/careers/${(jobs as any[])[0]?._id}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-accent-indigo to-accent-blue text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent-indigo/25 transition-all duration-300"
              >
                Apply Now
                <HiArrowLongRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
