const isAuthenticated = async function(req,res,next){
    if(!req.isAuthenticated()){
        res.cookie('formData',req.body)
        req.flash('error','you need to be logged in')
        res.redirect('/camps/login')
    }else{
        next()
    }
}

const isAuthenticatedd = async function(req,file,cb){
    console.log('ha')
    if(!req.isAuthenticated()){
        console.log(req);
        return cb(new Error('you need to be logged in'))
    }else{
        return cb(null,true)
    }
}

module.exports = {isAuthenticated,isAuthenticatedd};