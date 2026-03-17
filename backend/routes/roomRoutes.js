const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom
} = require("../controllers/RoomController");


// Create Room
router.post("/", protect, createRoom);

// Get All Rooms (with filters)
router.get("/", protect, getRooms);

// Get Single Room
router.get("/:id", protect, getRoomById);

// Update Room
router.put("/:id", protect, updateRoom);

// Delete Room
router.delete("/:id", protect, deleteRoom);

module.exports = router;