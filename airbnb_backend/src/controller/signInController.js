import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
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

export const loginGoogle = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Referrer-Policy", "no-referrer-when-downgrade");
  const redirectURL = "http://127.0.0.1:4000/api/auth/oauth";

  const oAuth2Client = new OAuth2Client(
    "577348327881-jup51l37c69tkcqem1paqoq1cpn5q5bs.apps.googleusercontent.com",
    "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",
    redirectURL
  );

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
    prompt: "consent",
  });

  res.json({ url: authorizeUrl });
};

async function getUserData(access_token) {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  return data;
}

export const oauthCallback = async (req, res, next) => {
  const code = req.query.code;

  try {
    const redirectURL = "http://127.0.0.1:4000/api/auth/oauth";
    const oAuth2Client = new OAuth2Client(
      "577348327881-jup51l37c69tkcqem1paqoq1cpn5q5bs.apps.googleusercontent.com",
      "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",
      redirectURL
    );
    const r = await oAuth2Client.getToken(code);
    await oAuth2Client.setCredentials(r.tokens);
    const userData = await getUserData(oAuth2Client.credentials.access_token);

    const user = await ThongTinNguoiDung.findOne({ where: { email: userData.email } });

    if (!user) {
      return res.redirect(303, "http://localhost:3000/auth/login?error=Email không tồn tại");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "7d" }
    );

    res.redirect(303, `http://localhost:3000/auth/login?token=${token}&userId=${user.id}`);
  } catch (err) {
    console.log("Error logging in with OAuth2 user", err);
    res.redirect(303, "http://localhost:3000/login?error=Lỗi máy chủ");
  }
};
