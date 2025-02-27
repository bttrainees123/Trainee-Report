import express, { Router } from 'express'
import {registerController,loginController,forgetPasswordController,testRouters} from '../controllers/authController.js'
import { isAdmin, registerSignIn } from '../middleware/authMiddleware.js';

const router = express.Router();

//post method/register
router.post('/register',registerController)

//post method/login
router.post('/login',loginController)
//post for forget Password
router.post('/forget',forgetPasswordController)

//registerSign Route for authenication
router.get('/middleware',registerSignIn,isAdmin, testRouters)


export default router;