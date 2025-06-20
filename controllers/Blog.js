import Blgomodel from "../models/Blog.js";
import { FileUploadToCloudinary } from "../libs/Cloudinary.js";
import { v2 as cloudinary } from 'cloudinary';


import fs from 'fs';
import path from 'path';
const Create = async (req, res) => {
    try {
        const { title, desc } = req.body;

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image file is required' });
        }

        const localPath = req.file.path;
        const cloudinaryUrl = await FileUploadToCloudinary(localPath, 'blog_images');

        const CreateBlog = new Blgomodel({
            title,
            desc,
            image: cloudinaryUrl, // ✅ now storing cloud URL
            author: req.user._id
        });

        await CreateBlog.save();

        // // Optional: delete local file
        // if (fs.existsSync(localPath)) fs.unlinkSync(localPath);

        res.status(201).json({
            success: true,
            message: 'Blog Created Successfully',
            blog: CreateBlog
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}



const update = async (req, res) => {
    try {
        const { title, desc } = req.body;
        const blogId = req.params.id;

        const blogToUpdate = await Blgomodel.findById(blogId);
        if (!blogToUpdate) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }

        if (title) blogToUpdate.title = title;
        if (desc) blogToUpdate.desc = desc;
        if (req.file) blogToUpdate.image = req.file.filename;

        await blogToUpdate.save();
        res.status(200).json({ success: true, message: 'Blog updated successfully', blog: blogToUpdate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const GetPosts = async (req, res) => {
    try {
        const posts = await Blgomodel.find().populate('author', '-password -__v');;

        if (!posts || posts.length === 0) {
            return res.status(404).json({ success: false, message: 'No blog posts found' });
        }
        


        res.status(200).json({ success: true, posts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const DeleteBlog = async (req, res) => {
    try {
        const postid = req.params.id
        console.log(postid)
        const posts = await Blgomodel.findById(postid)

        if (!posts) {
            return res.status(404).json({ success: false, message: 'Blog not found' });
        }
        if (posts.author.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You are not Authorised Author' });
        }
        // if (posts.image) {
        //     const profilePath = path.join('public/images', posts.image);
        //     fs.promises.unlink(profilePath)
        //         .then(() => console.log('Profile image deleted'))
        //         .catch(err => console.error('Error deleting profile image:', err));
        // }
        if (posts.image) {
            const publicId = posts.image.split('/').pop().split('.')[0]; // get last part before .jpg
            await cloudinary.uploader.destroy(`blog_images/${publicId}`);
        }

        const deletepost = await Blgomodel.findByIdAndDelete(postid)
        res.status(200).json({ success: true, message: "Post Delete Successfully", post: deletepost });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

const Getspecificpost = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: 'User doesnt Created any Post' });
        }
        const posts = await Blgomodel.find({ author: userId })
        return res.status(200).json({ success: true, posts });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
export { Create, update, GetPosts, DeleteBlog, Getspecificpost };
