import express from "express";
import upload from "../utils/uploadUtils.js";

const router = express.Router();

// Route để upload ảnh
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.status(200).send({ filename: req.file.filename });
});

// Route để xem ảnh
 
export default router;