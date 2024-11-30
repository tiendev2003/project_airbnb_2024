import express from "express";
import {
  createComment,
  deleteComment,
  getAllComments,
  getCommentsByRoom,
  updateComment,
} from "../controller/binhLuanController.js";

const router = express.Router();

// GET: Lấy tất cả bình luận
router.get("/", getAllComments);

// POST: Thêm bình luận mới
router.post("/", createComment);

// PUT: Cập nhật bình luận
router.put("/:id", updateComment);

// DELETE: Xóa bình luận
router.delete("/:id", deleteComment);

// GET: Lấy bình luận theo phòng
router.get("/lay-binh-luan-theo-phong/:MaPhong", getCommentsByRoom);

export default router;
