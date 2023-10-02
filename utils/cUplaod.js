// const {isAuthenticated,isAuthenticatedd} = require('../utils/isAuth')
// const {campValidator,campValidators} = require('../utils/campValidation');
// const fileSizeChecker = require('../utils/fileSizeChecker')
const fileCheckers = require('../utils/fileChecker')
const multer = require('multer');
// const s = (req)=>{
//     console.log("from file size");
//     console.log(req);
//     return true
// }
const {storage,cloudinary} = require('../cloudinary/index')
const cupload = function(req,res,next){
    const upload = multer({
        storage:storage,
        fileFilter: function(req, file, cb){
            fileCheckers(req,file,cb)
            // isAuthenticatedd(req,file,cb)
            // campValidator(req,file,cb)
            // fileSizeChecker(req,file,cb)
            // checkFileType(file, cb);
        },
        // limits:{fileSize:s(fileSize)}
            }).array('image',3);
    upload(req,res,function(err){
        // console.log(err)
        if(err instanceof multer.MulterError){
            if(err.message == 'Unexpected field'){
                return next(new AppError("Exceedind max number files allowed in images",500))}
                else{
                    return next(new AppError(err.message,500))
                }
        }else if(err){
            if(err.message == 'you need to be logged in'){  
             res.cookie('formData',req.body)
            req.flash('error','you need to be logged in')
            return res.redirect('/camps/login')}
            else if(err.message == 'Maximun 10mb only allowed'){  
             res.cookie('formData',req.body)
            req.flash('error','Maximun 10mb only allowed')
            return res.redirect('/camps/new')}
            else{
            return next(new AppError(err.message,err.status))}
        }else{
            return next();
        }
    })
}

module.exports = cupload