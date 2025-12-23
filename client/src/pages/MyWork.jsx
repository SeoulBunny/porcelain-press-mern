import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="text-lg font-bold">{title}</div>
          <button onClick={onClose} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-sm hover:bg-white/10">
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export default function MyWork() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editKind, setEditKind] = useState("article");
  const [editItem, setEditItem] = useState(null);
  const [msg, setMsg] = useState("");

  async function refresh() {
    const [as, js] = await Promise.all([api("/articles"), api("/journals")]);
    setArticles(as.filter(a => a.createdBy === user.id));
    setJournals(js.filter(j => j.createdBy === user.id));
  }

  useEffect(() => {
    let live = true;
    (async () => {
      try { await refresh(); } finally { if (live) setLoading(false); }
    })();
    return () => { live = false; };
  }, []);

  function openEdit(kind, item) {
    setEditKind(kind);
    setEditItem({ ...item });
    setEditOpen(true);
    setMsg("");
  }

  async function saveEdit() {
    setMsg("");
    try {
      const path = editKind === "journal" ? `/journals/${editItem.id}` : `/articles/${editItem.id}`;
      await api(path, { method: "PUT", body: JSON.stringify(editItem) });
      setEditOpen(false);
      await refresh();
      setMsg("Saved.");
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (loading) return <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">Loading…</div>;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">My work</h1>
      <p className="mt-2 text-slate-300">Writers can edit their own published items.</p>

      {msg ? <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">{msg}</div> : null}

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-bold">My articles ({articles.length})</div>
          <div className="mt-4 grid gap-3">
            {articles.length === 0 ? <div className="text-slate-300">None yet.</div> : null}
            {articles.map(a => (
              <div key={a.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="font-semibold">{a.title}</div>
                <div className="mt-1 text-sm text-slate-300">{a.subtitle}</div>
                <button onClick={() => openEdit("article", a)} className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-bold">My journals ({journals.length})</div>
          <div className="mt-4 grid gap-3">
            {journals.length === 0 ? <div className="text-slate-300">None yet.</div> : null}
            {journals.map(j => (
              <div key={j.id} className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                <div className="font-semibold">{j.title}</div>
                <div className="mt-1 text-sm text-slate-300">{j.subtitle}</div>
                <button onClick={() => openEdit("journal", j)} className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10">
                  Edit
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal open={editOpen} title={`Edit my ${editKind}`} onClose={() => setEditOpen(false)}>
        {editItem ? (
          <div className="grid gap-4">
            <div>
              <label className="block text-xs text-slate-300">Title</label>
              <input
                value={editItem.title || ""}
                onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Sub-title</label>
              <input
                value={editItem.subtitle || ""}
                onChange={(e) => setEditItem({ ...editItem, subtitle: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-300">Synopsis</label>
              <textarea
                value={editItem.synopsis || ""}
                onChange={(e) => setEditItem({ ...editItem, synopsis: e.target.value })}
                className="mt-1 min-h-[140px] w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={saveEdit} className="rounded-2xl">Save</Button>
              <button onClick={() => setEditOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10">
                Cancel
              </button>
            </div>
            <div className="text-xs text-slate-400">Editors/admins may overwrite content during review.</div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
