interface Props { page: number; totalPages: number; onPageChange: (p: number) => void; }
export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;
  const pages: number[] = [];
  const s = Math.max(1, page - 2), e = Math.min(totalPages, page + 2);
  for (let i = s; i <= e; i++) pages.push(i);
  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1} className="rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40 transition-colors">← Prev</button>
      {s > 1 && <><button onClick={() => onPageChange(1)} className="rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">1</button>{s > 2 && <span className="px-2 text-gray-400">...</span>}</>}
      {pages.map((p) => <button key={p} onClick={() => onPageChange(p)} className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${p === page ? "bg-navy-500 text-white" : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800"}`}>{p}</button>)}
      {e < totalPages && <>{e < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}<button onClick={() => onPageChange(totalPages)} className="rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">{totalPages}</button></>}
      <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages} className="rounded-xl px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-navy-800 disabled:opacity-40 transition-colors">Next →</button>
    </div>
  );
}
