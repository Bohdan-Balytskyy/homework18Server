const multer = require('multer');
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/app/components/uploads')
    },
    filename(req, file, cb) {
        cb(null, `${file.originalname}`);
    }
});
function fileFilter(req, file, cb){
    file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' ?
        cb(null, true) : cb(null, false);
}

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
})