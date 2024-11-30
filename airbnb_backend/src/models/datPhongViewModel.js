import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import { PhongViewModel } from "../models/phongViewModel.js";
import { ThongTinNguoiDung } from "../models/thongTinNguoiDung.js";


export const DatPhongViewModel = db.define("DatPhongViewModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  maPhong: { type: DataTypes.INTEGER, allowNull: false },
  ngayDen: { type: DataTypes.DATE, allowNull: false },
  ngayDi: { type: DataTypes.DATE, allowNull: false },
  soLuongKhach: { type: DataTypes.INTEGER, allowNull: false },
  maNguoiDung: { type: DataTypes.INTEGER, allowNull: false },
  trangThai: { type: DataTypes.STRING, allowNull: false },
  orderId: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.INTEGER, allowNull: false },
});

DatPhongViewModel.belongsTo(ThongTinNguoiDung, { foreignKey: "maNguoiDung" });
DatPhongViewModel.belongsTo(PhongViewModel, { foreignKey: "maPhong" });
