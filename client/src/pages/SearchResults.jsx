import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ContentCard from "../components/ContentCard.jsx";
import { api } from "../lib/api.js";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function SearchResults() {
  const query = useQuery();
  const q = (query.get("q") || "").trim();
  const navigate = useNavigate();

  const [data, setData] = useState({ journals: [], articles: [] });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      setLoading(true);
      setErr("");
      try {
        const res = await api(`/search?q=${encodeURIComponent(q)}`);
        if (live) setData(res);
      } catch (e) {
        if (live) setErr(e.message);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [q]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Search</h1>
      <p className="mt-2 text-slate-300">
        Query: <span className="text-white font-semibold">{q || "—"}</span>
      </p>

      {err ? (
        <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">{err}</div>
      ) : null}

      {loading ? (
        <div className="mt-8 text-slate-300">Searching…</div>
      ) : (
        <div className="mt-8 grid gap-10">
          <div>
            <div className="text-lg font-bold">Journals ({data.journals.length})</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {data.journals.map(j => (
                <ContentCard key={j.id} kind="journal" item={j} onClick={() => navigate(`/journals/${j.id}`)} />
              ))}
              {data.journals.length === 0 ? <div className="text-slate-300">No journal matches.</div> : null}
            </div>
          </div>

          <div>
            <div className="text-lg font-bold">Articles ({data.articles.length})</div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {data.articles.map(a => (
                <ContentCard key={a.id} kind="article" item={a} onClick={() => navigate(`/articles/${a.id}`)} />
              ))}
              {data.articles.length === 0 ? <div className="text-slate-300">No article matches.</div> : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
