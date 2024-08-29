const express =require('express');
const userRouter=express.Router()
const authMiddlewere=require('../middleware/authmiddleware');
const adminMiddleware=require('../middleware/adminMiddleware');
const {createUser,getUser,updateUser,deleteUser, getUserById}=require('../controllers/userController')



userRouter.post('/users',authMiddlewere,adminMiddleware,createUser)
userRouter.get('/users',authMiddlewere,getUser)
userRouter.get('/users/:id', authMiddlewere, getUserById);
userRouter.put('/users/:id',authMiddlewere,adminMiddleware,updateUser)
userRouter.delete('/users/:id',authMiddlewere,adminMiddleware,deleteUser)


module.exports=userRouter