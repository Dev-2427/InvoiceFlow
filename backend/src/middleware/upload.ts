import multer from "multer";

const storage = multer.memoryStorage()

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_, file, cb) => {
        const allowed = ["image/jpg", "image/jpeg", "image/png", "image/webp"]

        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Only JPG, PNG and WEBP files are allowed"))
        }

        cb(null, true)
    }
})

export default upload