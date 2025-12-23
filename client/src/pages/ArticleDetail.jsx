import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Pill from "../components/Pill.jsx";
import { api, uploadsUrl } from "../lib/api.js";

export default function ArticleDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const data = await api(`/articles/${id}`);
        if (live) setItem(data);
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => { live = false; };
  }, [id]);

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">Loading…</div>;
  if (!item) return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">Not found.</div>;

  const pdf = item.pdfUrl ? uploadsUrl(item.pdfUrl) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link to="/articles" className="text-sm text-slate-300 hover:text-white underline underline-offset-4">
        ← Back to articles
      </Link>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-extrabold">{item.title}</h1>
            {item.subtitle ? <p className="mt-2 text-slate-300">{item.subtitle}</p> : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {(item.writers || []).map(w => <Pill key={w}>{w}</Pill>)}
              {(item.tags || []).map(t => <Pill key={t}>#{t}</Pill>)}
              {item.journalId ? <Pill>Journal: {item.journalId}</Pill> : null}
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
            <div className="text-xs text-slate-300">Published</div>
            <div className="font-semibold">{item.publicationDate}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="text-lg font-bold">Synopsis</h2>
            <p className="mt-2 text-slate-300 leading-relaxed">{item.synopsis || "No synopsis yet."}</p>

            {pdf ? (
              <div className="mt-6">
                <a
                  href={pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-slate-300 hover:text-white underline underline-offset-4"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : null}
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/30 overflow-hidden">
            {pdf ? (
              <iframe title="PDF viewer" src={pdf} className="h-[520px] w-full" />
            ) : (
              <div className="p-6 text-slate-300">No PDF uploaded for this article yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
