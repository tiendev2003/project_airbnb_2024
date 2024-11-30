import express from "express";
import { signup } from "../controller/signUpController.js";
import { signin } from "../controller/signInController.js";

const router = express.Router();

// Đăng ký
router.post("/signup", signup);

// Đăng nhập
router.post("/signin", signin);

export default router;
