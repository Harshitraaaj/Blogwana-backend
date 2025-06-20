import express from 'express'
import { isAdmin,isLogin } from '../middleware/CheckAdmin.js'
import { contactCreate ,getContact,contactDelete} from '../controllers/Contact.js'

const ContactRoutes= express.Router()


ContactRoutes.post('/create',isLogin,contactCreate)
ContactRoutes.get('/getcontact',isAdmin,getContact)
ContactRoutes.delete('/delete/:id',isAdmin,contactDelete)





export default ContactRoutes