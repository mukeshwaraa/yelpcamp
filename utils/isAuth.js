const isAuthenticated = async function(req,res,next){
    if(!req.isAuthenticated()){
        res.cookie('formData',req.body)
        req.flash('error','you need to be logged in')
        res.redirect('/camps/login')
    }else{
        next()
    }
}


module.exports = isAuthenticated;