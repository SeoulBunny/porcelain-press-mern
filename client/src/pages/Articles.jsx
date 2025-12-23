import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentCard from "../components/ContentCard.jsx";
import { api } from "../lib/api.js";

export default function Articles() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await api("/articles");
        if (live) setItems(data);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i => (
      [i.title, i.subtitle, i.synopsis, ...(i.writers||[]), ...(i.tags||[])]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    ));
  }, [items, filter]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Articles</h1>
          <p className="mt-2 text-slate-300">All articles, newest first.</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 sm:w-[360px]">
          <label className="block text-xs text-slate-300">Filter on this page</label>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search titles, authors, tags…"
            className="mt-1 w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 text-slate-300">Loading…</div>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {filtered.map((a) => (
            <ContentCard
              key={a.id}
              item={a}
              kind="article"
              onClick={() => navigate(`/articles/${a.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
