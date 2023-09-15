const isAuth = function(req,res,next){
    if(!req.isAuthenticated()){
        req.flash('error','you need to be logged in')
        res.redirect('/camps/login')
    }else{
        next()
    }
}


module.exports = isAuth;