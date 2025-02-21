const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadDocument = upload.single("document");

module.exports = { uploadDocument };