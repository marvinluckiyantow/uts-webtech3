const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "photo") {
            cb(null, './uploads/photo/')
        } else if (['productImage'].includes(file.fieldname)) {
            cb(null, './uploads/product_image/')
        }
},
filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
}
})

const fileFilter = (req, file, cb, res) => {
    if ( file.mimetype === 'image/jpeg' || 
        file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ) {
            cb(null, true)
        } else {
            res.send({
            statusMessage: "Gagal",
            statusCode: 400,
            data: { isSuccess: false }
            })
        }
}

const limits = { fileSize: 1024 * 1024 * 10 } 

let upload = multer({ storage, fileFilter, limits }).fields(
    [
    { name: 'productImage',  maxCount: 1 },
    { name: 'product_image',  maxCount: 1 },
    { name: 'product_image_', maxCount: 1 }
    ]
)

const uploadFilter = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
        //A Multer error accured when uploading
            res.status(400).send({
            success: false,
            message: err.message
            })
        } else if (err) {
        // An unknown error accured when uploading
            res.status(400).send({
            success: false,
            message: err.message
            })
        }
        next()
        })
    }

module.exports = { uploadFilter }