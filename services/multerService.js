const multer = require("multer");
// storing file in memory and not disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports =  upload.single('document');