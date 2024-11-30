import { Sequelize } from "sequelize";

export const db = new Sequelize("travel", "root", "", {
  dialect: "mysql",
  host: "localhost",
 });
