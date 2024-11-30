import express from "express";
import { OAuth2Client } from "google-auth-library";
import { signin, loginGoogle, oauthCallback } from "../controller/signInController.js";
import { signup } from "../controller/signUpController.js";
const router = express.Router();

// Đăng ký
router.post("/signup", signup);

// Đăng nhập
router.post("/signin", signin);

router.post("/login-google", loginGoogle);

router.get("/oauth", oauthCallback);

export default router;
