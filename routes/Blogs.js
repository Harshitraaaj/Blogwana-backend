import express from 'express'
import { Create, DeleteBlog, GetPosts, update,Getspecificpost } from '../controllers/Blog.js'
import { upload } from '../middleware/Multer.js'
import { isAdmin,isLogin } from '../middleware/CheckAdmin.js'

const BlogRoutes= express.Router()


BlogRoutes.post('/create',isLogin,upload.single('post-image'),Create)
BlogRoutes.patch('/update/:id',isLogin,upload.single('post-image'),update)
BlogRoutes.get('/GetPosts',GetPosts)
BlogRoutes.delete('/delete/:id',isLogin,DeleteBlog)
BlogRoutes.get('/getpost/user/:userId',isLogin, Getspecificpost)





export default BlogRoutes