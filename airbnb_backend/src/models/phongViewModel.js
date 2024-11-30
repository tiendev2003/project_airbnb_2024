import { DataTypes } from "sequelize";
import { db } from "../config/database.js";
import { ViTriViewModel } from "../models/viTriViewModel.js";


export const PhongViewModel = db.define("PhongViewModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  tenPhong: { type: DataTypes.STRING, allowNull: false },
  khach: { type: DataTypes.INTEGER },
  phongNgu: { type: DataTypes.INTEGER },
  giuong: { type: DataTypes.INTEGER },
  phongTam: { type: DataTypes.INTEGER },
  moTa: { type: DataTypes.TEXT },
  giaTien: { type: DataTypes.INTEGER },
  mayGiat: { type: DataTypes.BOOLEAN },
  banLa: { type: DataTypes.BOOLEAN },
  tivi: { type: DataTypes.BOOLEAN },
  dieuHoa: { type: DataTypes.BOOLEAN },
  wifi: { type: DataTypes.BOOLEAN },
  bep: { type: DataTypes.BOOLEAN },
  doXe: { type: DataTypes.BOOLEAN },
  hoBoi: { type: DataTypes.BOOLEAN },
  banUi: { type: DataTypes.BOOLEAN },
  maViTri: { type: DataTypes.INTEGER, allowNull: false },
  hinhAnh: { type: DataTypes.STRING },
});

PhongViewModel.belongsTo(ViTriViewModel, { foreignKey: "maViTri" });
