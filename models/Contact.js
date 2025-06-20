import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    
    message: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const ContactModel = mongoose.model('Contact', ContactSchema);

export default ContactModel;
