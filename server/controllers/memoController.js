// controllers/memoController.js
const Memo = require('../models/memoModel');

const addMemo = async (req, res) => {
    try {
        const { content, project } = req.body;
        const memo = new Memo({
            content,
            author: req.user._id, // assuming the user is authenticated
            project
        });
        await memo.save();
        res.status(201).send(memo);
    } catch (error) {
        res.status(400).send({ message: 'Error adding memo', error });
    }
};

const getMemos = async (req, res) => {
    try {
        const memos = await Memo.find({ project: req.params.projectId }).populate('author');
        res.status(200).send(memos);
    } catch (error) {
        res.status(400).send({ message: 'Error getting memos', error });
    }
};

const updateMemo = async (req, res) => {
    try {
        const memo = await Memo.findById(req.params.id);
        if (!memo) return res.status(404).send('Memo Not Found');
        
        if (memo.author.toString() !== req.user._id.toString()) {
            return res.status(403).send('You are not authorized to update this memo');
        }

        memo.content = req.body.content;
        await memo.save();
        res.status(200).send(memo);
    } catch (error) {
        res.status(400).send({ message: 'Error updating memo', error });
    }
};

const deleteMemo = async (req, res) => {
    try {
        const memo = await Memo.findByIdAndDelete(req.params.id);
        if (!memo) return res.status(404).send('Memo Not Found');
        res.status(200).send({ message: 'Memo deleted successfully', memo });
    } catch (error) {
        res.status(400).send({ message: 'Error deleting memo', error });
    }
};

module.exports = { addMemo, getMemos, updateMemo, deleteMemo };
