const { User, Thought } = require('../models');

module.exports = {
    //get all Users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //get one user by their ID
    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //create new User
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //delete User
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete({ _id: req.params.userId });

            if (!user) {
              return res.status(404).json({ message: 'No user with that ID' });
            }

            //deletes the user's posts & friends
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            await User.deleteMany( { _id: { $in: user.friends }});

           res.json({ message: 'Users and their thoughts deleted!' });

        } catch (err) {
            res.status(500).json(err);
        }
    },

    //add Friend
    async addFriend(req, res) {
        try {
            const friend = await User.findOne({ _id: req.params.friendId });

            if (!friend) {
                return res.status(404).json( { message: "Friend ID Incorrect! No user found." });
            }

            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true }
            );

            if (!user) {
                return res.status(404).json( { message: "User ID Incorrect! No user found." });
            }

            const friendUpdate = await User.findOneAndUpdate(
                { _id: req.params.friendId },
                { $addToSet: { friends: req.params.userId } },
                { new: true }
            )

            return res.json( { message: "Successfully added friend!" });

        } catch (err) {
            res.status(500).json(err);
        }
    },
        //delete Friend
        async removeFriend(req, res) {
            try {
                //checking if friend's ID is valid
                const friend = await User.findOne({ _id: req.params.friendId });

                if (!friend) {
                    return res.status(404).json( { message: "Friend ID Incorrect! No user found." });
                }

                //find one and update to remove only that ID from friends array
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $pull: { friends: req.params.friendId } },
                    { new: true }
                );

                if (!user) {
                    return res.status(404).json( { message: "User ID Incorrect! No user found." });
                }

                const friendUpdate = User.findOneAndUpdate(
                    { _id: req.params.friendId },
                    { $pull: { friends: req.params.userId } },
                    { new: true });

            return res.json('Successfully removed friend!');

            } catch (err) {
                res.status(500).json(err);
            }
        },
}