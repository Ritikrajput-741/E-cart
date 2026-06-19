import multer from "multer";

export const storage = multer.memoryStorage();

/* for single store */

export const singleUpload = multer({ storage }).single("file");

/* for multiple store */

export const multipleUpload = multer({ storage }).array("files", 5);
