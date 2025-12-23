import { useState } from "react";
import Button from "../components/Button.jsx";
import { apiForm } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function SubmitWork() {
  const { user, hasRole } = useAuth();
  const [type, setType] = useState("article");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [writers, setWriters] = useState(user?.name || "");
  const [tags, setTags] = useState("");
  const [publicationDate, setPublicationDate] = useState(new Date().toISOString().slice(0, 10));
  const [pdf, setPdf] = useState(null);

  const [status, setStatus] = useState({ state: "idle", message: "" });

  if (!hasRole(["writer", "editor", "administrator"])) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-slate-300">
        You must be logged in as a writer/editor/admin to submit work.
      </div>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: "idle", message: "" });

    if (!pdf) {
      setStatus({ state: "error", message: "Please attach a PDF." });
      return;
    }

    const fd = new FormData();
    fd.append("type", type);
    fd.append("title", title);
    fd.append("subtitle", subtitle);
    fd.append("synopsis", synopsis);
    fd.append("writers", writers);
    fd.append("tags", tags);
    fd.append("publicationDate", publicationDate);
    fd.append("pdf", pdf);

    setStatus({ state: "loading", message: "Uploading…" });
    try {
      await apiForm("/submissions", fd);
      setStatus({ state: "ok", message: "Uploaded! Admins/editors will see this in their submission inbox." });
      setTitle(""); setSubtitle(""); setSynopsis(""); setTags(""); setPdf(null);
    } catch (e) {
      setStatus({ state: "error", message: e.message });
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">Submit work</h1>
      <p className="mt-2 text-slate-300">
        Upload a PDF for review. Admins/editors can approve or reject it.
      </p>

      <form onSubmit={onSubmit} className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm text-slate-300">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
            >
              <option value="article">Article</option>
              <option value="journal">Journal</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-300">Publication date (suggested)</label>
            <input
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              type="date"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              placeholder="Title of the work"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Sub-title</label>
            <input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              placeholder="Optional subtitle"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Writers (comma separated)</label>
            <input
              value={writers}
              onChange={(e) => setWriters(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              placeholder="e.g. Will Writer, Co Author"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              placeholder="e.g. esl, assessment, speaking"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">Synopsis</label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              placeholder="Short summary for reviewers"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-slate-300">PDF upload</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              required
            />
            <p className="mt-2 text-xs text-slate-400">PDFs are stored in server/uploads/submissions</p>
          </div>
        </div>

        {status.state !== "idle" ? (
          <div
            className={
              "mt-6 rounded-2xl border p-4 text-sm " +
              (status.state === "ok"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : status.state === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-white/10 bg-white/5 text-slate-200")
            }
          >
            {status.message}
          </div>
        ) : null}

        <div className="mt-6">
          <Button type="submit" className="w-full rounded-2xl" disabled={status.state === "loading"}>
            {status.state === "loading" ? "Uploading…" : "Upload for review"}
          </Button>
        </div>
      </form>
    </div>
  );
}
