const express = require("express");
const auth = require("../middleware/auth");
const hrhAuth = require("../middleware/hrhAuth");

const router = express.Router();

const {
  getAll,
  getById,
  getBySerial,
  getBySerialId,
  create,
  update,
  del,
} = require("../controllers/currentHistoryEndItemsControllers");

router.get("/:id", auth, getById);
router.get("/", auth, getAll);
router.get("/serial/:id", auth, getBySerial);
router.get("/serialid/:id", auth, getBySerialId);
router.post("/", hrhAuth, create);
router.patch("/:id", hrhAuth, update);
// router.delete('/:id', hrhAuth, del);

module.exports = router;
