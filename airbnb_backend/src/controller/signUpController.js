import bcrypt from "bcryptjs";
import { ThongTinNguoiDung } from "../models/thongTinNguoiDung.js";

// Đăng ký tài khoản mới
export const signup = async (req, res) => {
  try {
    const {
      user, // Nhận từ frontend (trường này thay vì username)
      password,
      checkPassword, // Nhận từ frontend (trường này thay vì confirmPassword)
      name,
      email,
      phone,
      birthday,
      gender,
      role, // Thêm trường role để nhận từ frontend
    } = req.body;
    console.log(req.body);
    // Kiểm tra xác nhận mật khẩu
    if (password !== checkPassword) {
      return res
        .status(400)
        .json({ message: "Mật khẩu và xác nhận mật khẩu không khớp" });
    }

    // Kiểm tra xem email đã tồn tại chưa
    const userExist = await ThongTinNguoiDung.findOne({ where: { email } });
    if (userExist) {
      return res.status(400).json({ message: "Email đã được đăng ký" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới trong cơ sở dữ liệu
    const newUser = await ThongTinNguoiDung.create({
      username: user, // Đổi từ user (frontend) thành username (backend yêu cầu)
      name,
      email,
      password: hashedPassword,
      phone,
      birthday,
      gender,
      role: role || "user", // Nếu không có role thì gán mặc định là "user"
    });

    // Phản hồi thành công
    res.status(201).json({
      message: "Đăng ký thành công",
      user: {
        id: newUser.id,
        username: newUser.username, // Đổi user thành username để phản hồi lại đúng cấu trúc
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        birthday: newUser.birthday,
        gender: newUser.gender,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
