import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import type { IconType } from 'react-icons';
import {
  SiAngular,
  SiDocker,
  SiFlutter,
  SiGo,
  SiKotlin,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPhp,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRuby,
  SiJavascript,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVuedotjs,
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { fetchSkills } from '@/utils/api';
import { AuroraTextEffect } from '@/components/ui/AuroraTextEffect';

type TechCard = {
  _id?: string;
  name: string;
  proficiency: number;
  color: string;
  iconKey: string;
  image?: string;
  order?: number;
};

const ICON_MAP: Record<string, IconType> = {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiVuedotjs,
  SiAngular,
  SiNodedotjs,
  SiJavascript,
  FaJava,
  SiPython,
  SiGo,
  SiPhp,
  SiRuby,
  SiFlutter,
  SiSwift,
  SiKotlin,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiJava: FaJava,
};



export default function SkillGlobe() {
  const { data } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    refetchOnWindowFocus: true,
  });

  const skills: TechCard[] = (Array.isArray(data) && data.length > 0 ? data : [])
    .slice()
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="relative py-28 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-bg-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(56,189,248,0.18),transparent_38%),radial-gradient(circle_at_82%_14%,rgba(139,92,246,0.18),transparent_34%),radial-gradient(circle_at_50%_88%,rgba(34,197,94,0.14),transparent_36%)]" />
      <div className="absolute inset-0 line-grid opacity-20" />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <span className="tag mb-5">Our Expertise</span>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-heading tracking-tight leading-[1.06]">
            Technologies We <AuroraTextEffect text="Master" />
          </h2>
          <p className="text-subtitle text-text-body mx-auto mt-4 max-w-3xl">
            Industry-leading tools and frameworks for building fast, scalable, and beautiful digital products.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-5">
          {skills.map((tech, index) => {
            const Icon = ICON_MAP[tech.iconKey] || SiReact;
            const delay = 0.04 * index;

            return (
              <motion.article
                key={tech.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay, ease: 'easeOut' }}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur-md px-4 py-5 md:px-5 md:py-6 hover:-translate-y-1 hover:border-white/20 transition-all duration-300"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `radial-gradient(circle at 50% -20%, ${tech.color}22 0%, transparent 58%)` }} />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl border border-white/10 bg-black/30 flex items-center justify-center mb-4">
                    {tech.image ? (
                      <img src={tech.image} alt={tech.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Icon className="w-8 h-8" style={{ color: tech.color }} />
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-text-heading leading-tight mb-5">{tech.name}</h3>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.16em] text-text-muted mb-2.5">
                      <span>Proficiency</span>
                      <span style={{ color: tech.color }}>{tech.proficiency}%</span>
                    </div>

                    <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.proficiency}%` }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.9, delay: delay + 0.1, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${tech.color}CC, ${tech.color})` }}
                      />
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
