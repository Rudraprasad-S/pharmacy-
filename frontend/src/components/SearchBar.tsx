interface Props { value: string; onChange: (v: string) => void; }
export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative w-full">
      <svg className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      <input type="text" placeholder="Search medicines by name or purpose..." value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-gray-300 dark:border-navy-600 bg-white dark:bg-navy-900 py-3 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-navy-500 focus:ring-2 focus:ring-navy-500/20 outline-none transition-colors shadow-sm" />
    </div>
  );
}
