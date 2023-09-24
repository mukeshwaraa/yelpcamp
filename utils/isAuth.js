const isAuth = async function(req,res,next){
    if(!req.isAuthenticated()){
        console.log(req.body);
        res.cookie('formData',req.body)
        req.flash('error','you need to be logged in')
        res.redirect('/camps/login')
    }else{
        next()
    }
}


module.exports = isAuth;