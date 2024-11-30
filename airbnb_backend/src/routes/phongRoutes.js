import express from "express";
import multer from "multer";
import {
  createRoom,
  deleteRoom,
  getAllRooms,
  getRoomById,
  getRoomsByLocation,
  paginateRooms,
  updateRoom,
} from "../controller/phongController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Lấy danh sách tất cả các phòng thuê.
router.get("/", getAllRooms);

// Thêm mới một phòng thuê.
router.post("/", upload.single("hinhanh"), createRoom);

// Lấy danh sách phòng theo mã vị trí.
router.get("/lay-phong-theo-vi-tri", getRoomsByLocation);

// Phân trang tìm kiếm phòng thuê.
router.get("/phan-trang-tim-kiem", paginateRooms);

// Lấy thông tin chi tiết một phòng thuê.
router.get("/:id", getRoomById);

// Cập nhật thông tin phòng thuê.
router.put("/:id", upload.single("hinhanh"), updateRoom);

// Xóa một phòng thuê.
router.delete("/:id", deleteRoom);

export default router;
