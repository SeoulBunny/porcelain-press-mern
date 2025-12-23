import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button.jsx";
import { api } from "../lib/api.js";
import { useAuth } from "../context/AuthContext.jsx";

function Panel({ title, subtitle, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <div className="text-lg font-bold">{title}</div>
        {subtitle ? (
          <div className="mt-1 text-sm text-slate-300">{subtitle}</div>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-slate-300">{label}</label>
      {children}
    </div>
  );
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-950 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="text-lg font-bold">{title}</div>
          <button
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1 text-sm hover:bg-white/10"
          >
            Close
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [journals, setJournals] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editOpen, setEditOpen] = useState(false);
  const [editKind, setEditKind] = useState("article");
  const [editItem, setEditItem] = useState(null);

  const [msg, setMsg] = useState("");

  async function refresh() {
    const [as, js, ss] = await Promise.all([
      api("/articles"),
      api("/journals"),
      api("/submissions"),
    ]);
    setArticles(as);
    setJournals(js);
    setSubs(ss);
  }

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        await refresh();
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, []);

  const pendingCount = useMemo(
    () => subs.filter((s) => s.status === "pending").length,
    [subs]
  );

  function openEdit(kind, item) {
    setEditKind(kind);
    setEditItem({ ...item });
    setEditOpen(true);
    setMsg("");
  }

  async function saveEdit() {
    setMsg("");
    try {
      const path =
        editKind === "journal"
          ? `/journals/${editItem.id}`
          : `/articles/${editItem.id}`;
      await api(path, { method: "PUT", body: JSON.stringify(editItem) });
      setEditOpen(false);
      await refresh();
      setMsg("Saved changes.");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function remove(kind, item) {
    setMsg("");
    if (!confirm(`Delete this ${kind}?`)) return;
    try {
      const path =
        kind === "journal" ? `/journals/${item.id}` : `/articles/${item.id}`;
      await api(path, { method: "DELETE" });
      await refresh();
      setMsg("Deleted.");
    } catch (e) {
      setMsg(e.message);
    }
  }

  async function setSubmissionStatus(id, status) {
    setMsg("");
    try {
      await api(`/submissions/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });
      await refresh();
      setMsg(`Submission marked as ${status}.`);
    } catch (e) {
      setMsg(e.message);
    }
  }

  if (loading)
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-slate-300">
        Loading admin…
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Admin dashboard</h1>
      <p className="mt-2 text-slate-300">
        Logged in as{" "}
        <span className="text-white font-semibold">{user.name}</span> (
        {user.role})
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Panel title="Submission inbox" subtitle={`${pendingCount} pending`}>
          <div className="text-sm text-slate-300">
            Writers upload PDFs here. Review and set status.
          </div>
        </Panel>
        <Panel
          title="Content management"
          subtitle="Edit & delete articles/journals"
        >
          <div className="text-sm text-slate-300">
            Editors/admins can update anything. Writers can only update their
            own items (not via this admin page).
          </div>
        </Panel>
      </div>

      {msg ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
          {msg}
        </div>
      ) : null}

      <div className="mt-8 grid gap-6">
        <Panel title="Submissions" subtitle="Newest first">
          <div className="grid gap-3">
            {subs.length === 0 ? (
              <div className="text-slate-300">No submissions yet.</div>
            ) : null}
            {subs.map((s) => (
              <div
                key={s.id}
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs text-slate-300">
                      {s.type.toUpperCase()} · {s.status.toUpperCase()}
                    </div>
                    <div className="mt-1 text-lg font-bold">{s.title}</div>
                    {s.subtitle ? (
                      <div className="mt-1 text-sm text-slate-300">
                        {s.subtitle}
                      </div>
                    ) : null}
                    <div className="mt-2 text-xs text-slate-300">
                      By: {s.writers.join(", ")} · Submitted by:{" "}
                      {s.createdByName}
                    </div>
                    <a
                      className="mt-2 inline-block text-sm text-slate-300 hover:text-white underline underline-offset-4"
                      href={`http://localhost:5000${s.fileUrl}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open uploaded PDF
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSubmissionStatus(s.id, "approved")}
                      className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200 hover:bg-emerald-500/20"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setSubmissionStatus(s.id, "rejected")}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => setSubmissionStatus(s.id, "pending")}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
                    >
                      Pending
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Journals">
          <div className="max-h-[520px] overflow-y-auto pr-2">
            <div className="grid gap-3">
              {journals.map((j) => (
                <div
                  key={j.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-300">
                      {j.publicationDate}
                    </div>
                    <div className="truncate text-base font-bold">
                      {j.title}
                    </div>
                    <div className="truncate text-sm text-slate-300">
                      {j.subtitle}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit("journal", j)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove("journal", j)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel title="Articles">
          <div className="max-h-[520px] overflow-y-auto pr-2">
            <div className="grid gap-3">
              {articles.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-slate-950/40 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-slate-300">
                      {a.publicationDate}
                    </div>
                    <div className="truncate text-base font-bold">
                      {a.title}
                    </div>
                    <div className="truncate text-sm text-slate-300">
                      {a.subtitle}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => openEdit("article", a)}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm hover:bg-white/10"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove("article", a)}
                      className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <Modal
        open={editOpen}
        title={`Edit ${editKind}`}
        onClose={() => setEditOpen(false)}
      >
        {editItem ? (
          <div className="grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={editItem.title || ""}
                  onChange={(e) =>
                    setEditItem({ ...editItem, title: e.target.value })
                  }
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
                />
              </Field>
              <Field label="Publication date">
                <input
                  value={editItem.publicationDate || ""}
                  onChange={(e) =>
                    setEditItem({
                      ...editItem,
                      publicationDate: e.target.value,
                    })
                  }
                  type="date"
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
                />
              </Field>
            </div>

            <Field label="Sub-title">
              <input
                value={editItem.subtitle || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, subtitle: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Synopsis">
              <textarea
                value={editItem.synopsis || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, synopsis: e.target.value })
                }
                className="mt-1 min-h-[140px] w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="Tags (array)">
              <input
                value={
                  Array.isArray(editItem.tags) ? editItem.tags.join(", ") : ""
                }
                onChange={(e) =>
                  setEditItem({
                    ...editItem,
                    tags: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
              />
            </Field>

            <Field label="PDF URL (served from /uploads/...)">
              <input
                value={editItem.pdfUrl || ""}
                onChange={(e) =>
                  setEditItem({ ...editItem, pdfUrl: e.target.value })
                }
                className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 outline-none"
                placeholder="/uploads/pdfs/yourfile.pdf"
              />
            </Field>

            <div className="flex gap-3">
              <Button onClick={saveEdit} className="rounded-2xl">
                Save
              </Button>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
              >
                Cancel
              </button>
            </div>

            <div className="text-xs text-slate-400">
              Note: with the fake backend, edits reset when you restart the
              server.
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
