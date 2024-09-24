const express =require('express');
const userRouter=express.Router()
const authMiddlewere=require('../middleware/authmiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
const {createUser,getUser,updateUser,deleteUser, getUserById, requestPasswordReset, resetPassword}=require('../controllers/userController')



userRouter.post('/users',authMiddlewere,adminMiddleware,createUser)
userRouter.get('/users',authMiddlewere,getUser)
userRouter.get('/users/:id', authMiddlewere, getUserById);
userRouter.put('/users/:id',authMiddlewere,adminMiddleware,updateUser)
userRouter.delete('/users/:id',authMiddlewere,adminMiddleware,deleteUser)

// Password reset routes
userRouter.post('/request-password-reset',authMiddlewere, requestPasswordReset); 
userRouter.patch('/reset-password', resetPassword);

module.exports=userRouter