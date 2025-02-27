 import { comparePasword, hashedPassword } from '../helpers/authhelper.js';
import userModel from '../models/userModel.js';
import JWT from 'jsonwebtoken'

 //Controller for register
 export const registerController = async(req,res)=>{
    try {
        
        const{name,email,password,phone,address} = req.body
        if(!name){
            return res.send({error:'The name is required'})
        }
        if(!email){
            return res.send({error:'The email is required'})
        }
        if(!password){
            return res.send({error:'The pasword is required'})
        }
        if(!phone){
            return res.send({error:'The phone is required'})
        }
        if(!address){
            return res.send({error:'The adddress is required'})
        }

        //check existing user
        const existingUserEmail = await userModel.findOne({email})
   
        //condition for existing user
        if(existingUserEmail){
            return res.status(500).send({
               success:true,
               message:'This Email is Already Registered Use Different',
               
            })
        }
        
        // hashed password
        const hashedPasswords = await hashedPassword(password)
        const user = await new userModel({name,email,phone, address,password:hashedPasswords}).save()

        //user register
        res.status(201).send({
            success:true,
            message:"User register successfully",
            user
        })

        //catch of register
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'registration Failed',
            error
        })
    }
}
//controller for Login
export const loginController =async (req,res)=>{
    try {
        const {email,password} =  req.body
        //validation
        if(!email || !password){
           return  res.status(404).send({
                success:false,
                message:'Invalid Email And Password',
                
            })
        }
     //check the user is registered user or not
     const user = await userModel.findOne({email})
     if(!user){
        return res.status(404).send({
            success:false,
            message:'Email is not Registered'
        })
     }
    //comparing the compare password
      const match = await comparePasword(password,user.password) 
      if(!match){
        return res.status(200).send({
            success:false,
            message:'Incorrect password'
        })
      }
      //create jwt token 
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success:true,
        message:"Login Successfully",
        user:{
            _id: user._id,
            name:user.name,
            email:user.email,
            phone:user.phone,
            address:user.address,
        }
        ,token
      })
      //catch of login
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Login Failed',
            error
        })
    }
}
//controller for forgetPasswordController
export const forgetPasswordController = async(req,res) =>{
    try {
        const {email,question,newPassword}=req.body 
        if(!email){
           res.status(400).send({message:'Email Is Required'})
        }
        if(!question){
            res.status(400).send({message:'Password Is Required'})
        }
        if(!newPassword){
            res.status(400).send({messsage:'NewPassword Is Required'})
        }

        //check the user is given correct question and email
        const user = await userModel.findOne({email,question})

        //give validation for above 
        if(!user){
            res.status(404).send({
                success:false,
                message:'Email and question is wrong'
            })
        }
        const hashed = await questionHash(newPassword);
        await userModel.findByIdAndUpdate(user._id,{password:hashed})
        res.status(200).send({
            success:true,
            message:'Passaord Reset Successfully'
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:'Something Went Wrong',
            error
        })
    }
}
//registerSignIn for testing routes

export const testRouters = (req,res)=>{
        res.send('this is protected')
}
