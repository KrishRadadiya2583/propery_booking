module.exports = (req,res,next)=>{
    
    const {password} = req.body;
    if(password.length < 8){
        return res.render("auth",{
            error: "Password must be at least 8 characters long"
        })
    }
    if(password.length > 12){
        return res.render("auth",{
            error: "Password must be at most 12 characters long"
        })
    }
    if(!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
        return res.render("auth",{
            error: "Password must contain min 8 characters and max 12 characters and at least one uppercase letter, one lowercase letter, one number and one special character "
        })
    }
    next();
}