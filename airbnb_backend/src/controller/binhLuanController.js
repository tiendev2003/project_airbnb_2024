import { BinhLuanViewModel } from "../models/binhLuanViewModel.js";
import { PhongViewModel } from "../models/phongViewModel.js";
import { ThongTinNguoiDung } from "../models/thongTinNguoiDung.js";

// Lấy tất cả bình luận
export const getAllComments = async (req, res) => {
  try {
    const comments = await BinhLuanViewModel.findAll({
      include: [
        { model: ThongTinNguoiDung, attributes: ["name", "email"] },
        { model: PhongViewModel, attributes: ["tenPhong"] },
      ],
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Lỗi khi lấy bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Thêm mới bình luận
export const createComment = async (req, res) => {
  try {
    const { maPhong, maNguoiBinhLuan, ngayBinhLuan, noiDung, saoBinhLuan } =
      req.body;

    const phong = await PhongViewModel.findByPk(maPhong);
    if (!phong) {
      return res.status(400).json({ message: "Phòng không tồn tại" });
    }

    const user = await ThongTinNguoiDung.findByPk(maNguoiBinhLuan);
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const newComment = await BinhLuanViewModel.create({
      maPhong,
      maNguoiBinhLuan,
      ngayBinhLuan,
      noiDung,
      saoBinhLuan,
    });

    res.status(201).json({
      message: "Thêm bình luận thành công",
      comment: newComment,
    });
  } catch (error) {
    console.error("Lỗi khi thêm bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật bình luận
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { noiDung, saoBinhLuan } = req.body;

    const comment = await BinhLuanViewModel.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    comment.noiDung = noiDung;
    comment.saoBinhLuan = saoBinhLuan;
    await comment.save();

    res.status(200).json({
      message: "Cập nhật bình luận thành công",
      comment,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await BinhLuanViewModel.findByPk(id);
    if (!comment) {
      return res.status(404).json({ message: "Bình luận không tồn tại" });
    }

    await comment.destroy();

    res.status(200).json({ message: "Xóa bình luận thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa bình luận:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy bình luận theo phòng
export const getCommentsByRoom = async (req, res) => {
  try {
    const { MaPhong } = req.params;

    const comments = await BinhLuanViewModel.findAll({
      where: { maPhong: MaPhong },
      include: [{ model: ThongTinNguoiDung, attributes: ["name", "email"] }],
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Lỗi khi lấy bình luận theo phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
