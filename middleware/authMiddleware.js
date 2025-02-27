import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js';

//registration
export const registerSignIn =async (req,res,next)=>{
      try {
        const decode = await JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        
        req.user =decode;
        next();
      } catch (error) {
        console.log(`this error from rigesterSignIN middleware ${error}`)
      }
}
export const isAdmin = async(req,res,next)=>{
    try {
        const user = await userModel.findById(req.user._id)
        if(user.role !==1){
           return res.status(401).send({
                success:true,
                message:'Access Denied',
            })
        }else{
            next();
        }
        
    } catch (error) {
        console.log(error)
        res.status(401).send({
            success:true,
            message:'Error from admin middleware'
        })
    }
}