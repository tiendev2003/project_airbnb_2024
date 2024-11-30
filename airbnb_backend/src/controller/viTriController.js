import { Op } from "sequelize";
import { ViTriViewModel } from "../models/viTriViewModel.js";

// Lấy tất cả vị trí
export const getAllLocations = async (req, res) => {
  try {
    const locations = await ViTriViewModel.findAll();
    res.status(200).json(locations);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Tạo vị trí mới
export const createLocation = async (req, res) => {
  try {
    const { tenViTri, tinhThanh, quocGia } = req.body;

    const maxUserId = await ViTriViewModel.max("id");
    const newUserId = maxUserId + 1;
    if (!req.file) {
      return res.status(400).json({ message: "Vui lòng tải lên hình ảnh" });
     }

    const newLocation = await ViTriViewModel.create({
      id: newUserId,
      tenViTri,
      tinhThanh,
      quocGia,
      hinhAnh: req.file.path,
     });
    res.status(201).json(newLocation);
  } catch (error) {
    console.error("Lỗi khi tạo vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Phân trang và tìm kiếm vị trí
export const getLocationsWithPaginationAndSearch = async (req, res) => {
  try {
    // Lấy các tham số phân trang và tìm kiếm từ query
    const { pageIndex = 1, pageSize = 8, keyword = "" } = req.query;

    // Chuyển đổi pageIndex và pageSize thành số nguyên
    const pageNumber = parseInt(pageIndex, 10);
    const sizeNumber = parseInt(pageSize, 10);

    // Kiểm tra giá trị pageIndex và pageSize
    if (isNaN(pageNumber) || isNaN(sizeNumber)) {
      return res
        .status(400)
        .json({ message: "pageIndex và pageSize phải là số hợp lệ." });
    }

    // Tính toán offset cho phân trang
    const offset = (pageNumber - 1) * sizeNumber;

    // Tìm kiếm và phân trang
    const locations = await ViTriViewModel.findAndCountAll({
      where: {
        tenViTri: {
          [Op.like]: `%${keyword}%`,
        },
      },
      limit: sizeNumber,
      offset: offset,
    });

    // Định dạng dữ liệu trả về
    res.status(200).json({
      data: locations.rows, // Danh sách vị trí
      total: locations.count, // Tổng số vị trí
      totalPages: Math.ceil(locations.count / sizeNumber), // Tổng số trang
      currentPage: pageNumber, // Trang hiện tại
    });
  } catch (error) {
    console.error("Lỗi khi phân trang và tìm kiếm vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Lấy vị trí theo ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await ViTriViewModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Vị trí không tìm thấy" });
    }

    res.status(200).json(location);
  } catch (error) {
    console.error("Lỗi khi lấy vị trí theo ID:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Cập nhật vị trí theo ID
export const updateLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const { tenViTri, tinhThanh, quocGia } = req.body;

    const location = await ViTriViewModel.findByPk(id);
    let hinhAnh = req.file ? req.file.path : location.hinhAnh;
    

    if (!location) {
      return res.status(404).json({ message: "Vị trí không tìm thấy" });
    }

    await location.update({ tenViTri, tinhThanh, quocGia, hinhAnh });
    res.status(200).json(location);
  } catch (error) {
    console.error("Lỗi khi cập nhật vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};

// Xóa vị trí theo ID
export const deleteLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const location = await ViTriViewModel.findByPk(id);

    if (!location) {
      return res.status(404).json({ message: "Vị trí không tìm thấy" });
    }

    await location.destroy();
    res.status(200).json({ message: "Xóa vị trí thành công" });
  } catch (error) {
    console.error("Lỗi khi xóa vị trí:", error);
    res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
};


// // Hàm upload hình ảnh cho vị trí


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const uploadDir = path.join(__dirname, "../uploads", "locations");

// // Tạo thư mục lưu file nếu chưa tồn tại
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// export const uploadLocationImage = async (req, res) => {
//   try {
//     // Kiểm tra xem có file hay không
//     if (!req.files || !req.files.formFile) {
//       return res.status(400).json({ message: "Vui lòng gửi hình ảnh vị trí" });
//     }

//     // Lấy file từ request
//     const image = req.files.formFile;

//     // Kiểm tra nếu không có tên file, không thể di chuyển
//     if (!image.name) {
//       return res.status(400).json({ message: "Tên file không hợp lệ" });
//     }

//     // Tạo đường dẫn lưu file
//     const uploadPath = path.join(uploadDir, image.name);
//     console.log("Đường dẫn upload:", uploadPath); // Kiểm tra đường dẫn trong console

//     // Di chuyển file tới thư mục đã chỉ định
//     image.mv(uploadPath, (err) => {
//       if (err) {
//         console.error("Lỗi khi upload file:", err);
//         return res
//           .status(500)
//           .json({ message: "Lỗi máy chủ", error: err.message });
    //       }

    //       // Cập nhật vào cơ sở dữ liệu nếu cần
//       const maViTri = req.query.maViTri; // Lấy mã vị trí từ query string
//       ViTriViewModel.update({ hinhAnh: uploadPath }, { where: { id: maViTri } })
//         .then(() => {
//           res.status(200).json({
//             message: "Hình ảnh đã được tải lên thành công",
//             hinhAnhPath: uploadPath,
//           });
//         })
//         .catch((error) => {
//           console.error("Lỗi khi cập nhật thông tin vị trí:", error);
//           res.status(500).json({
//             message: "Lỗi khi cập nhật thông tin vị trí",
//             error: error.message,
//           });
//         });
//     });
//   } catch (error) {
//     console.error("Lỗi khi tải hình ảnh:", error);
        //     res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
      //   }
// };
