import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // Import JWT để tạo token
import { ThongTinNguoiDung } from "../models/thongTinNguoiDung.js";

// Đăng nhập
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Tìm người dùng dựa vào email
    const user = await ThongTinNguoiDung.findOne({ where: { email } });

    // Kiểm tra xem người dùng có tồn tại không
    if (!user) {
      return res.status(400).json({ message: "Email không tồn tại" });
    }

    // Lấy mật khẩu được mã hóa từ cơ sở dữ liệu
    const storedHashedPassword = user.password;

    // Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(
      password,
      storedHashedPassword
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu không đúng" });
    }

    // Tạo token JWT để gửi cho frontend
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role }, // Payload
      process.env.JWT_SECRET || "default_secret_key", // Secret key
      { expiresIn: "7d" } // Thời hạn token (7 ngày)
    );

    // Phản hồi thành công với thông tin người dùng và token
    res.status(200).json({
      message: "Đăng nhập thành công",
      content: {
        token, // Gửi token cho frontend
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          birthday: user.birthday,
          gender: user.gender,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
