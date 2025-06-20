import express from 'express'
import dotenv from 'dotenv'
import AuthRoutes from './routes/Auth.js'
import DBCon from './libs/db.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import BlogRoutes from './routes/Blogs.js'
import DashboardRoutes from './routes/Dashboard.js'
import CommentRoutes from './routes/Comments.js'
import PublicRoutes from './routes/Public.js'
import ContactRoutes from './routes/Contact.js'

dotenv.config()

const PORT=process.env.PORT || 4000
const app=express()
DBCon()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);


app.use(express.static('public'))
app.use(cookieParser())
const corsOptoins={
    origin:'https://blogwana-frontend.vercel.app',
    credentials:true
}
app.use(cors(corsOptoins))
app.use('/auth',AuthRoutes)
app.use('/blog',BlogRoutes)
app.use('/dashboard',DashboardRoutes)
app.use('/comment',CommentRoutes)
app.use('/public',PublicRoutes)
app.use('/contact', ContactRoutes)

app.listen(PORT,()=>{
    console.log(`App is running on Port ${PORT}`)
})
