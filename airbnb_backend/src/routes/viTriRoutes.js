import express from "express";
import {
  createLocation,
  deleteLocationById,
  getAllLocations,
  getLocationById,
  getLocationsWithPaginationAndSearch,
  updateLocationById,
} from "../controller/viTriController.js";
import upload from "../utils/uploadUtils.js";

const router = express.Router();

// Lấy tất cả các vị trí
router.get("/", getAllLocations);

// Tạo mới một vị trí
router.post("/", upload.single("hinhanh") ,createLocation);

// Tìm kiếm và phân trang vị trí
router.get("/phan-trang-tim-kiem", getLocationsWithPaginationAndSearch);

// Lấy thông tin vị trí theo id
router.get("/:id", getLocationById);

// Cập nhật thông tin vị trí theo id
router.put("/:id", upload.single("hinhanh"),updateLocationById);

// Xóa vị trí theo id
router.delete("/:id", deleteLocationById);

// // Upload hình ảnh cho vị trí
// router.post("/upload-hinh-vitri", uploadLocationImage);

export default router;
