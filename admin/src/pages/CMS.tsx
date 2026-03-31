import { useState, useEffect, useId } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCMSContent, updateCMSContent } from '@/services/api';
import { useToast } from '@/components/ui/Toast';
import { Dropdown, type DropdownOption } from '@/components/ui/Dropdown';
import { HiOutlinePlus, HiOutlineTrash, HiOutlineChevronDown, HiOutlineChevronUp, HiOutlineArrowUpTray, HiOutlinePhoto, HiArrowUp } from 'react-icons/hi2';

const PAGES = ['home', 'about', 'services', 'solutions', 'portfolio', 'careers', 'contact'];

const SOCIAL_PLATFORMS = ['twitter', 'linkedin', 'instagram', 'facebook', 'youtube', 'threads', 'github', 'tiktok', 'discord', 'whatsapp'];

/* ─── tiny reusable form parts ─── */
const Field = ({ label, value, onChange, multiline, placeholder }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }) => (
  <div>
    <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>{label}</label>
    {multiline ? (
      <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/40 resize-y" />
    ) : (
      <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/40" />
    )}
  </div>
);

/* ─── Collapsible section ─── */
const Section = ({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-white/[0.06] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-white bg-white/[0.03] hover:bg-white/[0.05] transition-colors">
        {title}
        {open ? <HiOutlineChevronUp className="w-4 h-4 text-gray-500" /> : <HiOutlineChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && <div className="p-4 space-y-4">{children}</div>}
    </div>
  );
};

/* ─── Social Links Editor ─── */
const SocialLinksEditor = ({ links, onChange }: { links: Array<{ platform: string; href: string }>; onChange: (v: Array<{ platform: string; href: string }>) => void }) => {
  const platformOptions: DropdownOption[] = SOCIAL_PLATFORMS.map(p => ({ value: p, label: p.charAt(0).toUpperCase() + p.slice(1) }));
  
  return (
    <Section title="Social Links">
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-32 flex-shrink-0">
              <Dropdown 
                value={link.platform} 
                onChange={e => { const n = [...links]; n[i] = { ...n[i], platform: e }; onChange(n); }}
                options={platformOptions}
                placeholder="Platform"
              />
            </div>
            <input value={link.href} onChange={e => { const n = [...links]; n[i] = { ...n[i], href: e.target.value }; onChange(n); }} placeholder="https://..."
              className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/40" />
            <button onClick={() => onChange(links.filter((_, j) => j !== i))} className="p-2 text-red-400 hover:text-red-300 transition-colors"><HiOutlineTrash className="w-4 h-4" /></button>
          </div>
        ))}
        <button onClick={() => onChange([...links, { platform: 'twitter', href: '' }])}
          className="flex items-center gap-1.5 text-xs text-accent-indigo hover:text-accent-indigo/80 transition-colors">
          <HiOutlinePlus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>
    </Section>
  );
};

/* ─── List Item Editor (stats, process steps, values, team, perks, etc.) ─── */
const ListEditor = ({ title, items, fields, onChange }: { title: string; items: any[]; fields: { key: string; label: string; multiline?: boolean }[]; onChange: (v: any[]) => void }) => (
  <Section title={`${title} (${items.length})`} defaultOpen={false}>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">#{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-300"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
          </div>
          {fields.map(f => (
            <Field key={f.key} label={f.label} multiline={f.multiline} value={item[f.key] ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], [f.key]: v }; onChange(n); }} />
          ))}
        </div>
      ))}
      <button onClick={() => { const empty: any = {}; fields.forEach(f => empty[f.key] = ''); onChange([...items, empty]); }}
        className="flex items-center gap-1.5 text-xs text-accent-indigo hover:text-accent-indigo/80">
        <HiOutlinePlus className="w-3.5 h-3.5" /> Add {title.replace(/s$/, '')}
      </button>
    </div>
  </Section>
);

/* ─── Modern Image Upload Component ─── */
const ModernImageUpload = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => {
  const [isDragging, setIsDragging] = useState(false);
  const uploadId = useId();

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="relative group">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
        id={uploadId}
      />
      <label
        htmlFor={uploadId}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`block p-4 rounded-lg border-2 border-dashed transition-all cursor-pointer ${
          isDragging
            ? 'border-accent-indigo bg-accent-indigo/10 scale-[1.02]'
            : 'border-white/[0.1] bg-white/[0.02] hover:border-accent-indigo/50 hover:bg-accent-indigo/5'
        }`}
      >
        {value ? (
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 ring-2 ring-accent-indigo/30">
              <img src={value} alt="preview" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs text-white/60">Click to change image</p>
              <p className="text-[10px] text-white/40 mt-0.5">or drag & drop here</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-3">
            <HiOutlineArrowUpTray className="w-5 h-5 text-accent-indigo/60 mb-2 group-hover:text-accent-indigo transition-colors" />
            <p className="text-xs font-medium text-white/70 group-hover:text-white transition-colors">Upload image</p>
            <p className="text-[10px] text-white/40 mt-0.5">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </label>
    </div>
  );
};

/* ─── Team Members Editor with Image Upload ─── */
const TeamEditor = ({ items, onChange }: { items: any[]; onChange: (v: any[]) => void }) => (
  <Section title={`Team Members (${items.length})`} defaultOpen={false}>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-4 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-4 group hover:border-white/[0.12] transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-indigo/20 flex items-center justify-center">
                <HiOutlinePhoto className="w-4 h-4 text-accent-indigo/60" />
              </div>
              <span className="text-xs font-semibold text-white/60">Member #{i + 1}</span>
            </div>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"><HiOutlineTrash className="w-4 h-4" /></button>
          </div>
          
          <ModernImageUpload 
            value={item.image ?? ''} 
            onChange={v => { const n = [...items]; n[i] = { ...n[i], image: v }; onChange(n); }} 
          />
          
          <div className="space-y-3">
            <Field label="Name" value={item.name ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], name: v }; onChange(n); }} />
            <Field label="Role" value={item.role ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], role: v }; onChange(n); }} />
            <Field label="Bio" multiline value={item.bio ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], bio: v }; onChange(n); }} />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { name: '', role: '', bio: '', image: '' }])}
        className="flex items-center gap-1.5 text-xs text-accent-indigo hover:text-accent-indigo/80 transition-colors px-3 py-2 rounded hover:bg-accent-indigo/5">
        <HiOutlinePlus className="w-4 h-4" /> Add Team Member
      </button>
    </div>
  </Section>
);

/* ─── Solutions Items Editor ─── */
const SolutionsEditor = ({ items, onChange }: { items: any[]; onChange: (v: any[]) => void }) => (
  <Section title={`Solutions (${items.length})`} defaultOpen={false}>
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">#{i + 1}</span>
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="p-1 text-red-400 hover:text-red-300"><HiOutlineTrash className="w-3.5 h-3.5" /></button>
          </div>
          <Field label="Title" value={item.title ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], title: v }; onChange(n); }} />
          <Field label="Description" multiline value={item.description ?? ''} onChange={v => { const n = [...items]; n[i] = { ...n[i], description: v }; onChange(n); }} />
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'rgba(148,163,184,0.7)' }}>Features (comma-separated)</label>
            <input value={(item.features || []).join(', ')} onChange={e => { const n = [...items]; n[i] = { ...n[i], features: e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean) }; onChange(n); }}
              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-accent-indigo/40" />
          </div>
        </div>
      ))}
      <button onClick={() => onChange([...items, { title: '', description: '', features: [] }])}
        className="flex items-center gap-1.5 text-xs text-accent-indigo hover:text-accent-indigo/80">
        <HiOutlinePlus className="w-3.5 h-3.5" /> Add Solution
      </button>
    </div>
  </Section>
);

/* ─── Page-specific form renderers ─── */
function renderHomeForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const hero = c.hero || {};
  const cta = c.cta || {};
  const set = (path: string, value: any) => {
    const parts = path.split('.');
    const next = { ...c };
    let obj: any = next;
    for (let i = 0; i < parts.length - 1; i++) {
      obj[parts[i]] = { ...obj[parts[i]] };
      obj = obj[parts[i]];
    }
    obj[parts[parts.length - 1]] = value;
    setContent(next);
  };

  return (
    <div className="space-y-5">
      <Section title="Hero">
        <Field label="Title" value={hero.title} onChange={v => set('hero.title', v)} />
        <Field label="Subtitle" multiline value={hero.subtitle} onChange={v => set('hero.subtitle', v)} />
        <Field label="CTA Button Text" value={hero.cta} onChange={v => set('hero.cta', v)} />
      </Section>
      <ListEditor title="Stats" items={c.stats || []} onChange={v => set('stats', v)} fields={[{ key: 'value', label: 'Value' }, { key: 'label', label: 'Label' }]} />
      <ListEditor title="Process Steps" items={c.process || []} onChange={v => set('process', v)} fields={[{ key: 'step', label: 'Step #' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', multiline: true }]} />
      <Section title="CTA Section">
        <Field label="Title" value={cta.title} onChange={v => set('cta.title', v)} />
        <Field label="Subtitle" multiline value={cta.subtitle} onChange={v => set('cta.subtitle', v)} />
        <Field label="Button Text" value={cta.buttonText} onChange={v => set('cta.buttonText', v)} />
      </Section>
      <SocialLinksEditor links={c.socialLinks || []} onChange={v => set('socialLinks', v)} />
    </div>
  );
}

function renderAboutForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="About Info">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Story" multiline value={c.story} onChange={v => set('story', v)} />
        <Field label="Mission" multiline value={c.mission} onChange={v => set('mission', v)} />
        <Field label="Vision" multiline value={c.vision} onChange={v => set('vision', v)} />
      </Section>
      <ListEditor title="Values" items={c.values || []} onChange={v => set('values', v)} fields={[{ key: 'title', label: 'Title' }, { key: 'description', label: 'Description', multiline: true }]} />
      <TeamEditor items={c.team || []} onChange={v => set('team', v)} />
    </div>
  );
}

function renderServicesForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="Services Page Header">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Description" multiline value={c.description} onChange={v => set('description', v)} />
      </Section>
      <ListEditor title="Process Steps" items={c.process || []} onChange={v => set('process', v)} fields={[{ key: 'step', label: 'Step #' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description', multiline: true }]} />
    </div>
  );
}

function renderSolutionsForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="Solutions Page Header">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Description" multiline value={c.description} onChange={v => set('description', v)} />
      </Section>
      <SolutionsEditor items={c.items || []} onChange={v => set('items', v)} />
    </div>
  );
}

function renderPortfolioForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="Portfolio Page Header">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Description" multiline value={c.description} onChange={v => set('description', v)} />
      </Section>
    </div>
  );
}

function renderCareersForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="Careers Page Header">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Description" multiline value={c.description} onChange={v => set('description', v)} />
      </Section>
      <ListEditor title="Perks" items={c.perks || []} onChange={v => set('perks', v)} fields={[{ key: 'icon', label: 'Icon (emoji)' }, { key: 'title', label: 'Title' }, { key: 'description', label: 'Description' }]} />
    </div>
  );
}

function renderContactForm(content: any, setContent: (c: any) => void) {
  const c = content || {};
  const set = (key: string, value: any) => setContent({ ...c, [key]: value });
  return (
    <div className="space-y-5">
      <Section title="Contact Info">
        <Field label="Title" value={c.title} onChange={v => set('title', v)} />
        <Field label="Subtitle" multiline value={c.subtitle} onChange={v => set('subtitle', v)} />
        <Field label="Email" value={c.email} onChange={v => set('email', v)} placeholder="info@example.com" />
        <Field label="Phone" value={c.phone} onChange={v => set('phone', v)} placeholder="+91 ..." />
        <Field label="Address" value={c.address} onChange={v => set('address', v)} />
        <Field label="Business Hours" value={c.businessHours} onChange={v => set('businessHours', v)} placeholder="Monday - Friday: 9:00 AM - 6:00 PM" />
        <Field label="Weekend Hours" value={c.weekendHours} onChange={v => set('weekendHours', v)} placeholder="Weekend: By appointment" />
      </Section>
    </div>
  );
}

const PAGE_RENDERERS: Record<string, (content: any, setContent: (c: any) => void) => React.ReactNode> = {
  home: renderHomeForm,
  about: renderAboutForm,
  services: renderServicesForm,
  solutions: renderSolutionsForm,
  portfolio: renderPortfolioForm,
  careers: renderCareersForm,
  contact: renderContactForm,
};

export default function CMS() {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<any>(null);
  const [showJson, setShowJson] = useState(false);
  const [jsonValue, setJsonValue] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cms', selectedPage],
    queryFn: () => getCMSContent(selectedPage),
  });

  // Reset when switching pages
  useEffect(() => {
    setContent(null);
    setJsonValue('');
    setJsonError('');
    setShowJson(false);
  }, [selectedPage]);

  // Populate when data loads
  useEffect(() => {
    if (data !== undefined) {
      const c = data?.content ?? data ?? {};
      setContent(c);
      setJsonValue(JSON.stringify(c, null, 2));
      setJsonError('');
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: any) => updateCMSContent(selectedPage, payload),
    onSuccess: () => {
      toast.success('Content saved successfully');
      queryClient.invalidateQueries({ queryKey: ['cms'] });
    },
    onError: () => {
      toast.error('Failed to save content');
    },
  });

  const handleSave = () => {
    if (showJson) {
      try {
        const parsed = JSON.parse(jsonValue);
        setJsonError('');
        mutation.mutate(parsed);
      } catch {
        setJsonError('Invalid JSON');
      }
    } else {
      mutation.mutate(content);
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    try {
      const parsed = JSON.parse(value);
      setContent(parsed);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  // Sync content → jsonValue when modifying via form
  const handleContentChange = (c: any) => {
    setContent(c);
    setJsonValue(JSON.stringify(c, null, 2));
  };

  const renderer = PAGE_RENDERERS[selectedPage];

  const scrollToTop = () => {
    // Find the scrollable container (the main content area in AdminLayout)
    const scrollContainer = document.querySelector('main > div:last-child');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CMS Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit page content changes are saved to the database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJson(!showJson)}
            className="h-9 px-4 rounded-lg text-sm font-medium transition-colors"
            style={{ background: showJson ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.06)', color: showJson ? '#a78bfa' : 'rgba(148,163,184,0.8)', border: `1px solid ${showJson ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.08)'}` }}
          >
            {showJson ? 'Form View' : 'JSON View'}
          </button>
          <button
            onClick={handleSave}
            disabled={(showJson && !!jsonError) || mutation.isPending || isLoading}
            className="h-9 px-5 bg-accent-indigo text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-accent-indigo/90 transition-colors"
          >
            {mutation.isPending ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Page Selector */}
      <div className="flex flex-wrap gap-2">
        {PAGES.map((page) => (
          <button
            key={page}
            onClick={() => setSelectedPage(page)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              selectedPage === page
                ? 'bg-accent-indigo text-white'
                : 'bg-bg-card text-gray-400 hover:text-white border border-white/[0.06]'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Content Editor */}
      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <span className="text-sm text-gray-400">
            Editing: <span className="text-white capitalize">{selectedPage}</span>
          </span>
          {showJson && jsonError && <span className="text-xs text-red-400">{jsonError}</span>}
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-white/[0.04] rounded w-3/4" />
            <div className="h-4 bg-white/[0.04] rounded w-1/2" />
            <div className="h-4 bg-white/[0.04] rounded w-5/6" />
            <div className="h-64 bg-white/[0.04] rounded mt-4" />
          </div>
        ) : showJson ? (
          <textarea
            value={jsonValue}
            onChange={(e) => handleJsonChange(e.target.value)}
            spellCheck={false}
            className={`w-full min-h-[500px] p-4 bg-transparent text-sm font-mono focus:outline-none resize-y transition-colors ${jsonError ? 'text-red-300' : 'text-gray-300'}`}
          />
        ) : (
          <div className="p-5">
            {renderer != null && content ? renderer(content, handleContentChange) : <p className="text-gray-500 text-sm">No form available for this page.</p>}
          </div>
        )}
      </div>

      {/* Floating Go to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)',
          boxShadow: '0 8px 20px rgba(167, 139, 250, 0.4)'
        }}
        aria-label="Back to top"
        title="Go to top"
      >
        <HiArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
}
