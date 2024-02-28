const { User, Thought } = require("../models");

module.exports = {
    //get all thoughts
    getThought(req, res) {
        try {
            Thought.find()
            .then((thought) => res.json(thought));
        } catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //get one thought
    getSingleThought(req, res) {
        try {
            const thought = Thought.findOne({ _id: req.params.thoughtId })
                .select("-__v")
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought with that ID' });
            }
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //post to create a new thought
    newThought(req, res) {
        try {
            const thought = Thought.create(req.body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $push: { thoughts: _id } },
                        { new: true }
                    );
                })
                .then((thought) =>
                    !thought
                        ? res.status(404).json({ message: "No thought found with this ID!" })
                        : res.json(thought)
                )
        }
        catch (err) {
            console.log(err);
            return res.status(500).json(err);
        }
    },
    //put to update a thought by its id
    updateThought(req, res) {
        try {
            const thought = Thought.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete to remove a thought by its _id
    deleteThought(req, res) {
        try {
            const thought = Thought.findOneAndDelete(
                { _id: req.params.thoughtId },
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }
            res.json({ message: 'Thought deleted!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //post to create a reaction stored in a single thought's reactions array field
    createReaction(req, res) {
        try {
            const thought = Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
    //delete to pull and remove a reaction by the reaction's reactionId value
    deleteReaction(req, res) {
        try {
            const thought = Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            if (!thought) {
                return res
                    .status(404)
                    .json({ message: 'No thought found with that ID :(' });
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },
};