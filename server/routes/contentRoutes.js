const router = require("express").Router();
const { auth, requireRole } = require("../middleware/auth");
const c = require("../controllers/contentController");

// Public read
router.get("/journals", c.getJournals);
router.get("/journals/:id", c.getJournal);
router.get("/articles", c.getArticles);
router.get("/articles/:id", c.getArticle);
router.get("/search", c.search);

// Protected writes
router.post("/journals", auth, requireRole(["editor", "administrator"]), c.createJournal);
router.put("/journals/:id", auth, c.updateJournal);
router.delete("/journals/:id", auth, c.deleteJournal);

router.post("/articles", auth, requireRole(["editor", "administrator"]), c.createArticle);
router.put("/articles/:id", auth, c.updateArticle);
router.delete("/articles/:id", auth, c.deleteArticle);

module.exports = router;
