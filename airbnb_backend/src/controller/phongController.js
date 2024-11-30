import { Op } from "sequelize";
import { PhongViewModel } from "../models/phongViewModel.js";
import { ViTriViewModel } from "../models/viTriViewModel.js";

// Lấy danh sách tất cả các phòng thuê
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await PhongViewModel.findAll({
      include: {
        model: ViTriViewModel,
        attributes: ["tenViTri", "tinhThanh", "quocGia"],
      },
    });
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Thêm mới một phòng thuê
export const createRoom = async (req, res) => {
  try {
    const { tenPhong, maViTri, giaPhong } = req.body;
   

    const image = req.file ? req.file.path : null;
    const newRoom = await PhongViewModel.create({ ...req.body, hinhAnh:image, image });
    res.status(201).json({ message: "Tạo phòng thành công", room: newRoom });
  } catch (error) {
    console.error("Lỗi khi tạo phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy danh sách phòng theo mã vị trí
export const getRoomsByLocation = async (req, res) => {
  try {
    const { maViTri } = req.query;
    const rooms = await PhongViewModel.findAll({ where: { maViTri } });
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Lỗi khi lấy phòng theo vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Phân trang và tìm kiếm phòng
export const paginateRooms = async (req, res) => {
  try {
    const { pageIndex = 1, pageSize = 10, keyword = "" } = req.query;

    const pageNumber = parseInt(pageIndex, 10);
    const sizeNumber = parseInt(pageSize, 10);

    if (isNaN(pageNumber) || isNaN(sizeNumber)) {
      return res.status(400).json({ message: "pageIndex và pageSize phải là số hợp lệ." });
    }

    const offset = (pageNumber - 1) * sizeNumber;

    const rooms = await PhongViewModel.findAndCountAll({
      where: {
        tenPhong: {
          [Op.like]: `%${keyword}%`,
        },
      },
      limit: sizeNumber,
      offset: offset,
      include: {
        model: ViTriViewModel,
        attributes: ["tenViTri", "tinhThanh", "quocGia"],
      },
    });

    res.status(200).json({
      data: rooms.rows,
      total: rooms.count,
      totalPages: Math.ceil(rooms.count / sizeNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Lỗi khi phân trang và tìm kiếm phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy thông tin chi tiết một phòng thuê theo ID
export const getRoomById = async (req, res) => {
  try {
    const { id } = req.params;
    const room = await PhongViewModel.findByPk(id, {
      include: {
        model: ViTriViewModel,
        attributes: ["tenViTri", "tinhThanh", "quocGia"],
      },
    });
    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật thông tin phòng thuê theo ID
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenPhong, maViTri, giaPhong } = req.body;
    

    const image = req.file ? req.file.path : null;
    const updatedData = image ? { ...req.body, hinhAnh:image } : req.body;

    const updatedRoom = await PhongViewModel.update(updatedData, {
      where: { id },
    });
    if (updatedRoom[0] === 0) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }
    res.status(200).json({ message: "Cập nhật phòng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Xóa một phòng thuê theo ID
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await PhongViewModel.destroy({ where: { id } });
    if (!deletedRoom) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }
    res.status(200).json({ message: "Xóa phòng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
