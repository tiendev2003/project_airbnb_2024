import { DataTypes } from "sequelize";
import { db } from "../config/database.js";

export const ThongTinNguoiDung = db.define("ThongTinNguoiDung", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  birthday: { type: DataTypes.STRING },
  gender: { type: DataTypes.BOOLEAN },
  avatar: { type: DataTypes.STRING },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
  },
});
