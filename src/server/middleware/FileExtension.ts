import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: process.env.PROFILE_DEST,
    filename: (req, file, cb) => {
        const extensionName = path.extname(file.originalname)        
        cb(null,req.params.idUser + (extensionName == '.jpeg' ? '.jpg' : extensionName));
    } 
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: Number(process.env.PROFILE_MAXSIZE)},
    fileFilter: function(_req, file, cb){
        const allowedFileExtensions = ['.jpg', '.jpeg'];
        const extension = path.extname(file.originalname).toLowerCase();
        if (!allowedFileExtensions.includes(extension)) {
            return cb(new Error('Only .jpg and .jpeg files are allowed'));
        }

        const allowedMimeTypes = ['image/jpeg', 'image/jpg'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only .jpeg and .jpg image mimetypes are allowed'));
        }

        cb(null, true);
    },
});