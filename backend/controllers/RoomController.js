const Room = require("../models/room.js");


// ✅ Create Room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ Get All Rooms + Filters
exports.getRooms = async (req, res) => {
  try {
    const { city, propertyType, minRent, maxRent, furnishing } = req.query;

    let query = {};

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (furnishing) {
      query.furnishing = furnishing;
    }

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    const rooms = await Room.find(query).sort({ createdAt: -1 });

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Get Single Room
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Update Room
exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


// ✅ Delete Room
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};