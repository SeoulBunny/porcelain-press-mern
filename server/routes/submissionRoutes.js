const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const { auth, requireRole } = require("../middleware/auth");
const s = require("../controllers/submissionController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads", "submissions")),
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/[^a-z0-9\._-]/gi, "_");
    cb(null, Date.now() + "_" + safe);
  }
});

function fileFilter(req, file, cb) {
  if (file.mimetype !== "application/pdf") return cb(new Error("Only PDF files allowed"));
  cb(null, true);
}

const upload = multer({ storage, fileFilter });

router.post("/", auth, requireRole(["writer", "editor", "administrator"]), upload.single("pdf"), s.createSubmission);
router.get("/", auth, requireRole(["editor", "administrator"]), s.getAllSubmissions);
router.get("/mine", auth, requireRole(["writer", "editor", "administrator"]), s.getMySubmissions);
router.put("/:id/status", auth, requireRole(["editor", "administrator"]), s.updateStatus);

module.exports = router;
