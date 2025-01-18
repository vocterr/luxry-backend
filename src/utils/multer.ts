import multer from "multer";
import path from "path"

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${Date.now()}`)
    },
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "..", "uploads"))
    }
});

export const upload = multer({storage});