import ContactModel from "../models/Contact.js"


const contactCreate = async (req, res) => {
    try {
        const { fullname, email, subject, message } = req.body;
        const userId = req.user._id;

        if (!fullname || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const newContact = new ContactModel({
            userId,
            fullname,
            email,
            subject,
            message
        });
        await newContact.save();
        res.status(201).json({ success: true, message: 'Contact created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
}

const getContact = async (req, res) => {
    try {
        const user = req.user;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can perform this action.' });
        }

  const contacts = await ContactModel.find().populate('userId', 'FullName email');

    console.log(contacts);

        return res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });

    }
}

const contactDelete = async (req, res) => {
    try {
        const user = req.user;
        const contactId = req.params.id;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only admin can perform this action.' });
        }
        const contact = await ContactModel.findByIdAndDelete(contactId);
        if (!contact) {
            return res.status(404).json({ success: false, message: 'Contact not found' });
        }
        return res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
        
    }
}

export { contactCreate ,getContact, contactDelete };