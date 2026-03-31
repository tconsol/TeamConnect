import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCMSContent, updateCMSContent } from '@/services/api';
import toast from 'react-hot-toast';

const PAGES = ['home', 'about', 'services', 'solutions', 'portfolio', 'careers', 'contact'];

export default function CMS() {
  const queryClient = useQueryClient();
  const [selectedPage, setSelectedPage] = useState('home');
  const [jsonValue, setJsonValue] = useState('');
  const [jsonError, setJsonError] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['cms', selectedPage],
    queryFn: () => getCMSContent(selectedPage),
  });

  // Reset editor when switching pages
  useEffect(() => {
    setJsonValue('');
    setJsonError('');
  }, [selectedPage]);

  // Populate editor when data loads/changes
  useEffect(() => {
    if (data !== undefined) {
      setJsonValue(JSON.stringify(data?.content ?? data ?? {}, null, 2));
      setJsonError('');
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: (content: any) => updateCMSContent(selectedPage, content),
    onSuccess: () => {
      toast.success('Content saved successfully');
      queryClient.invalidateQueries({ queryKey: ['cms'] });
    },
    onError: () => {
      toast.error('Failed to save content');
    },
  });

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonError('');
      mutation.mutate(parsed);
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      setJsonValue(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON — cannot format');
    }
  };

  const handleJsonChange = (value: string) => {
    setJsonValue(value);
    try {
      JSON.parse(value);
      setJsonError('');
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">CMS Content</h1>
          <p className="text-sm text-gray-500 mt-0.5">Edit page content as JSON — changes are saved to the database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleFormat}
            disabled={isLoading}
            className="px-4 py-2 bg-white/[0.06] text-gray-300 rounded-lg text-sm hover:bg-white/[0.10] transition-colors disabled:opacity-40"
          >
            Format
          </button>
          <button
            onClick={handleSave}
            disabled={!!jsonError || mutation.isPending || isLoading}
            className="px-4 py-2 bg-accent-indigo text-white rounded-lg disabled:opacity-50 hover:bg-accent-indigo/90 transition-colors"
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

      {/* JSON Editor */}
      <div className="bg-bg-card border border-white/[0.06] rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
          <span className="text-sm text-gray-400">
            Editing: <span className="text-white capitalize">{selectedPage}</span>
          </span>
          <div className="flex items-center gap-4">
            {!isLoading && !jsonError && jsonValue && (
              <span className="text-xs text-gray-600">{jsonValue.length.toLocaleString()} chars</span>
            )}
            {jsonError && <span className="text-xs text-red-400">{jsonError}</span>}
          </div>
        </div>
        {isLoading ? (
          <div className="p-6 space-y-3 animate-pulse">
            <div className="h-4 bg-white/[0.04] rounded w-3/4" />
            <div className="h-4 bg-white/[0.04] rounded w-1/2" />
            <div className="h-4 bg-white/[0.04] rounded w-5/6" />
            <div className="h-4 bg-white/[0.04] rounded w-2/3" />
            <div className="h-64 bg-white/[0.04] rounded mt-4" />
          </div>
        ) : (
          <textarea
            value={jsonValue}
            onChange={(e) => handleJsonChange(e.target.value)}
            spellCheck={false}
            className={`w-full min-h-[500px] p-4 bg-transparent text-sm font-mono focus:outline-none resize-y transition-colors ${
              jsonError ? 'text-red-300' : 'text-gray-300'
            }`}
          />
        )}
      </div>
    </div>
  );
}
