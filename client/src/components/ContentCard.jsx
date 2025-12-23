import Pill from "./Pill.jsx";

export default function ContentCard({ item, kind = "article", onClick }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-300">{kind === "journal" ? "Journal" : "Article"}</div>
          <div className="mt-1 truncate text-lg font-bold group-hover:text-white">{item.title}</div>
          {item.subtitle ? (
            <div className="mt-1 line-clamp-2 text-sm text-slate-300">{item.subtitle}</div>
          ) : null}
        </div>
        <div className="shrink-0 rounded-2xl border border-white/10 bg-slate-950/40 px-3 py-2 text-xs text-slate-200">
          {item.publicationDate}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {(item.writers || []).slice(0, 3).map((w) => <Pill key={w}>{w}</Pill>)}
        {(item.tags || []).slice(0, 2).map((t) => <Pill key={t}>#{t}</Pill>)}
      </div>

      <p className="mt-4 line-clamp-3 text-sm text-slate-300">
        {item.synopsis || "No synopsis provided yet."}
      </p>

      <div className="mt-4 text-xs text-slate-300 group-hover:text-white underline underline-offset-4">
        Open details →
      </div>
    </button>
  );
}
