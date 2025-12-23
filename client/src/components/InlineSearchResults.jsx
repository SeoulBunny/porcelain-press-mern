import { useEffect } from "react";

export default function InlineSearchResults({
  q,
  data,
  loading,
  err,
  activeIndex,
  setActiveIndex,
  onSelect,
  onViewAll
}) {
  const items = [
    ...data.journals.map(j => ({
      id: `journal-${j.id}`,
      label: j.title,
      path: `/journals/${j.id}`
    })),
    ...data.articles.map(a => ({
      id: `article-${a.id}`,
      label: a.title,
      path: `/articles/${a.id}`
    }))
  ];

  // keep active index in bounds
  useEffect(() => {
    if (activeIndex >= items.length) {
      setActiveIndex(items.length - 1);
    }
  }, [items.length, activeIndex, setActiveIndex]);

  if (err) {
    return <div className="p-4 text-red-300">{err}</div>;
  }

  if (loading) {
    return <div className="p-4 text-slate-300">Searching…</div>;
  }

  if (!items.length) {
    return <div className="p-4 text-slate-300">No results.</div>;
  }

  return (
    <ul className="divide-y divide-white/10">
      {items.map((item, i) => (
        <li
          key={item.id}
          onMouseEnter={() => setActiveIndex(i)}
          onClick={() => onSelect(item.path)}
          className={`px-4 py-3 cursor-pointer text-sm ${
            i === activeIndex
              ? "bg-white/10 text-white"
              : "text-slate-300 hover:bg-white/5"
          }`}
        >
          {item.label}
        </li>
      ))}

      {/* VIEW ALL */}
      <li
        onClick={onViewAll}
        className="px-4 py-3 text-sm text-slate-400 hover:text-white hover:bg-white/5 cursor-pointer"
      >
        View all results for “<span className="text-white">{q}</span>”
      </li>
    </ul>
  );
}
