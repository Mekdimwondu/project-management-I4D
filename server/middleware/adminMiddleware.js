const jwt=require('jsonwebtoken')
const User=require('../models/user')

const adminMiddleware= async (req,res,next)=>{
    try {
        const user=await User.findById(req.user.id);
        if(!user){
            return res.status(404).send("User not found")
        }
        if(user.role !=="Admin"){
            return res.status(403).send("Accuss Denied: Admins Only");

        }
        next();
    } catch (err) {
        res.status(500).send("Server Error" ,err)
        
    }
}
module.exports=adminMiddleware;