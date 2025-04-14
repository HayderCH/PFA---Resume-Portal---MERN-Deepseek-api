import multer from 'multer';

const storage = multer.memoryStorage(); // ← this keeps file in memory

const upload = multer({ storage });

export default upload;
