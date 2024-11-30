import axios from "axios";
import crypto from "crypto-js";
import { v4 as uuidv4 } from "uuid";
import { DatPhongViewModel } from "../models/datPhongViewModel.js";
import { PhongViewModel } from "../models/phongViewModel.js";
import { ThongTinNguoiDung } from "../models/thongTinNguoiDung.js";

// Lấy tất cả thông tin đặt phòng
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await DatPhongViewModel.findAll({
      include: [
        { model: PhongViewModel, attributes: ["tenPhong", "giaTien"] },
        { model: ThongTinNguoiDung, attributes: ["name", "email"] },
      ],
    });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Tạo một đặt phòng mới
export const createBooking = async (req, res) => {
  try {
    const { maPhong, ngayDen, ngayDi, soLuongKhach, maNguoiDung } = req.body;

    // Kiểm tra mã phòng và mã người dùng có tồn tại
    const room = await PhongViewModel.findByPk(maPhong);
    const user = await ThongTinNguoiDung.findByPk(maNguoiDung);
    if (!room) {
      return res.status(400).json({ message: "Phòng không tồn tại" });
    }
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    const newBooking = await DatPhongViewModel.create({
      maPhong,
      ngayDen,
      ngayDi,
      soLuongKhach,
      maNguoiDung,
      orderId: uuidv4(),
      trangThai: "pending",
      amount: room.giaTien * soLuongKhach,
    });

    res.status(201).json({
      message: "Tạo đặt phòng thành công",
      newBooking,
    });
  } catch (error) {
    console.error("Lỗi khi tạo đặt phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const paymentWithMomo = async (req, res, next) => {
  const { orderId, total } = req.body;
  var partnerCode = "MOMOBKUN20180529";
  var accessKey = "klm05TvNBzhg7h7j";
  var secretkey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
  var requestId = partnerCode + new Date().getTime();
  var orderInfo = "pay with MoMo";
  var redirectUrl = "http://localhost:3000/Detail/profile";
  var ipnUrl =
    "https://d21c-116-98-165-237.ngrok-free.app/api/dat-phong/callback-with-momo";
  var amount = total.toString();
  var requestType = "payWithMethod";
  var extraData = "";
  console.log("Request to MoMo: ", req.body);

  var rawSignature =
    "accessKey=" +
    accessKey +
    "&amount=" +
    amount +
    "&extraData=" +
    extraData +
    "&ipnUrl=" +
    ipnUrl +
    "&orderId=" +
    orderId +
    "&orderInfo=" +
    orderInfo +
    "&partnerCode=" +
    partnerCode +
    "&redirectUrl=" +
    redirectUrl +
    "&requestId=" +
    requestId +
    "&requestType=" +
    requestType;

  const signature = crypto
    .HmacSHA256(rawSignature, secretkey)
    .toString(crypto.enc.Hex);

  const requestBody = JSON.stringify({
    partnerCode: partnerCode,
    accessKey: accessKey,
    requestId: requestId,
    amount: amount,
    orderId: orderId,
    orderInfo: orderInfo,
    redirectUrl: redirectUrl,
    ipnUrl: ipnUrl,
    extraData: extraData,
    requestType: requestType,
    signature: signature,
    lang: "en",
  });
  // options for axios
  const options = {
    method: "POST",
    url: "https://test-payment.momo.vn/v2/gateway/api/create",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  console.log("Request to MoMo: ", options);

  try {
    const result = await axios(options);
    if (result.data.resultCode !== 0) {
      console.log("Payment failed: ", result.data);
      return res.status(400).json({
        message: "Thanh toán thất bại",
        error: result.data.message,
      });
    }
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("Error when payment with MoMo: ", error);
    return res.status(500).json({
      message: "Thanh toán thất bại",
      error: error.message,
    });
  }
};

// Lấy thông tin đặt phòng theo ID
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await DatPhongViewModel.findByPk(id, {
      include: [
        { model: PhongViewModel, attributes: ["tenPhong", "giaTien"] },
        { model: ThongTinNguoiDung, attributes: ["name", "email"] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }

    res.status(200).json(booking);
  } catch (error) {
    console.error("Lỗi khi lấy thông tin đặt phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

export const paymentCallback = async (req, res) => {
  try {
    const { orderId, resultCode } = req.body;
    if (resultCode === 0) {
      const order = await DatPhongViewModel.findOne({ where: { orderId: orderId } });

      if (order) {
        order.trangThai = "Đã thanh toán";
        await order.save();
      } else {
        res.status(404).json({ message: "Đơn hàng không tồn tại" });
      }
    }
    res
      .status(200)
      .json({ message: "Cập nhật trạng thái đơn hàng thành công" });
  } catch (error) {
    console.error("Error when payment callback: ", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật thông tin đặt phòng
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { maPhong, ngayDen, ngayDi, soLuongKhach, maNguoiDung } = req.body;

    const booking = await DatPhongViewModel.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }

    const room = await PhongViewModel.findByPk(maPhong);
    const user = await ThongTinNguoiDung.findByPk(maNguoiDung);
    if (!room) {
      return res.status(400).json({ message: "Phòng không tồn tại" });
    }
    if (!user) {
      return res.status(400).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật đặt phòng
    await booking.update({
      maPhong,
      ngayDen,
      ngayDi,
      soLuongKhach,
      maNguoiDung,
    });

    res.status(200).json({
      message: "Cập nhật đặt phòng thành công",
      booking,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật đặt phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Xóa đặt phòng
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await DatPhongViewModel.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: "Đặt phòng không tồn tại" });
    }

    await booking.destroy();

    res.status(200).json({ message: "Xóa đặt phòng thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa đặt phòng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy danh sách đặt phòng theo người dùng
export const getBookingsByUser = async (req, res) => {
  try {
    const { MaNguoiDung } = req.params;

    const bookings = await DatPhongViewModel.findAll({
      where: { maNguoiDung: MaNguoiDung },
      include: [
        { model: PhongViewModel, attributes: ["tenPhong", "giaTien"] },
        { model: ThongTinNguoiDung, attributes: ["name", "email"] },
      ],
    });

    if (!bookings.length) {
      return res
        .status(404)
        .json({ message: "Người dùng chưa có đặt phòng nào" });
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đặt phòng theo người dùng:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};
