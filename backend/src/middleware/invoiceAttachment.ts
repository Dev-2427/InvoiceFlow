import multer from "multer";

const storage = multer.memoryStorage()

const invoiceAttachment = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024
    },
    fileFilter: (_, file, cb) => {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Only PDF files are allowed"))
        }
        cb(null, true)
    }
})

export default invoiceAttachment