import { DataTypes } from "sequelize";
import { db } from "../config/database.js";


export const DangNhapView = db.define("DangNhapView", {
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
});
