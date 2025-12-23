const { nanoid } = require("nanoid");
let journals = require("../data/journals");
let articles = require("../data/articles");

// helper: newest first
function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.publicationDate) - new Date(a.publicationDate));
}

/**
 * Permissions:
 * - administrator: full access
 * - editor: can create/update/delete any journal/article
 * - writer: can create drafts via submissions; can update their OWN articles/journals (createdBy matches)
 * - user: read-only
 */
function canEdit(user, item) {
  if (!user) return false;
  if (user.role === "administrator" || user.role === "editor") return true;
  if (user.role === "writer") return item && item.createdBy === user.id;
  return false;
}

// Journals
function getJournals(req, res) {
  res.json(sortByDateDesc(journals));
}
function getJournal(req, res) {
  const item = journals.find(j => j.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Journal not found" });
  res.json(item);
}
function createJournal(req, res) {
  const data = req.body || {};
  const newItem = {
    id: "j_" + nanoid(8),
    title: data.title || "Untitled Journal",
    subtitle: data.subtitle || "",
    writers: data.writers || [req.user.name],
    writerIds: data.writerIds || [req.user.id],
    publicationDate: data.publicationDate || new Date().toISOString().slice(0,10),
    volume: data.volume || "",
    issue: data.issue || "",
    tags: data.tags || [],
    synopsis: data.synopsis || "",
    pdfUrl: data.pdfUrl || "",
    createdBy: req.user.id
  };
  journals = [newItem, ...journals];
  res.status(201).json(newItem);
}
function updateJournal(req, res) {
  const idx = journals.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Journal not found" });

  const item = journals[idx];
  if (!canEdit(req.user, item)) return res.status(403).json({ message: "Forbidden" });

  journals[idx] = { ...item, ...req.body };
  res.json(journals[idx]);
}
function deleteJournal(req, res) {
  const item = journals.find(j => j.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Journal not found" });
  if (!canEdit(req.user, item)) return res.status(403).json({ message: "Forbidden" });

  journals = journals.filter(j => j.id !== req.params.id);
  res.json({ ok: true });
}

// Articles
function getArticles(req, res) {
  res.json(sortByDateDesc(articles));
}
function getArticle(req, res) {
  const item = articles.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Article not found" });
  res.json(item);
}
function createArticle(req, res) {
  const data = req.body || {};
  const newItem = {
    id: "a_" + nanoid(8),
    title: data.title || "Untitled Article",
    subtitle: data.subtitle || "",
    writers: data.writers || [req.user.name],
    writerIds: data.writerIds || [req.user.id],
    publicationDate: data.publicationDate || new Date().toISOString().slice(0,10),
    journalId: data.journalId || null,
    tags: data.tags || [],
    synopsis: data.synopsis || "",
    pdfUrl: data.pdfUrl || "",
    createdBy: req.user.id
  };
  articles = [newItem, ...articles];
  res.status(201).json(newItem);
}
function updateArticle(req, res) {
  const idx = articles.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Article not found" });

  const item = articles[idx];
  if (!canEdit(req.user, item)) return res.status(403).json({ message: "Forbidden" });

  articles[idx] = { ...item, ...req.body };
  res.json(articles[idx]);
}
function deleteArticle(req, res) {
  const item = articles.find(a => a.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Article not found" });
  if (!canEdit(req.user, item)) return res.status(403).json({ message: "Forbidden" });

  articles = articles.filter(a => a.id !== req.params.id);
  res.json({ ok: true });
}

// Search
function search(req, res) {
  const q = String(req.query.q || "").toLowerCase().trim();
  if (!q) return res.json({ journals: [], articles: [] });

  const hit = (item) => {
    const blob = [
      item.title, item.subtitle, item.synopsis,
      ...(item.writers || []),
      ...(item.tags || []),
      item.volume, item.issue
    ].filter(Boolean).join(" ").toLowerCase();
    return blob.includes(q);
  };

  res.json({
    journals: sortByDateDesc(journals.filter(hit)),
    articles: sortByDateDesc(articles.filter(hit))
  });
}

module.exports = {
  // journals
  getJournals, getJournal, createJournal, updateJournal, deleteJournal,
  // articles
  getArticles, getArticle, createArticle, updateArticle, deleteArticle,
  // search
  search
};
