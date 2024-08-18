const User = require('../models/user');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
    try {
        const { 
            firstName, lastName, email, phoneNumber, gender, jobType, workType, experienceLevel, role, bio,
        } = req.body;

        // Hash the password before saving
       

        const user = new User({
            firstName, lastName, email, password: email, phoneNumber, gender, jobType, workType, experienceLevel, role, bio,
        });

        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const getUser = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(400).send(error);
    }
};

const updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).send('User Not found');

        updates.forEach(update => user[update] = req.body[update]);

        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        await user.save();
        res.status(200).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) return res.status(404).send('User not found');
        res.status(200).send('User deleted');
    } catch (error) {
        res.status(400).send(error);
    }
};

module.exports = { createUser, getUser, updateUser, deleteUser };
