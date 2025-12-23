const path = require("path");
const { nanoid } = require("nanoid");

let submissions = []; // in-memory

function getAllSubmissions(req, res) {
  // admin/editor only (enforced in route)
  res.json([...submissions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function getMySubmissions(req, res) {
  const mine = submissions.filter(s => s.createdBy === req.user.id);
  res.json(mine.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
}

function createSubmission(req, res) {
  const data = req.body || {};
  if (!req.file) return res.status(400).json({ message: "PDF file required" });

  const sub = {
    id: "s_" + nanoid(10),
    type: data.type === "journal" ? "journal" : "article",
    title: data.title || "Untitled",
    subtitle: data.subtitle || "",
    synopsis: data.synopsis || "",
    writers: data.writers ? String(data.writers).split(",").map(s => s.trim()).filter(Boolean) : [req.user.name],
    publicationDate: data.publicationDate || new Date().toISOString().slice(0,10),
    tags: data.tags ? String(data.tags).split(",").map(s => s.trim()).filter(Boolean) : [],
    fileUrl: "/uploads/submissions/" + req.file.filename,
    originalFilename: req.file.originalname,
    status: "pending",
    createdBy: req.user.id,
    createdByName: req.user.name,
    createdAt: new Date().toISOString()
  };

  submissions = [sub, ...submissions];
  res.status(201).json(sub);
}

function updateStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body || {};
  const idx = submissions.findIndex(s => s.id === id);
  if (idx === -1) return res.status(404).json({ message: "Submission not found" });

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  submissions[idx] = { ...submissions[idx], status };
  res.json(submissions[idx]);
}

module.exports = { getAllSubmissions, getMySubmissions, createSubmission, updateStatus };
