const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const foundUser = await User.findOne({
          $or: [{ _id: user ? user._id : params.id }, { username: params.username }],
        });

        return foundUser;
      }

      // throw new AuthenticationError('Not logged in');
    },
    users: async () => {
      return User.find();
    }
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect Credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, args, context) => {
      // will need to refactor this to work only while logged in and using args/context
      const userId = '61bf9b2e02dffb3e6460e3dd';
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { savedBooks: args.input } },
        { new: true, runValidators: true }
      )

      return updatedUser;
    },
    removeBook: async (parent, args, context) => {
      // will need to refactor this to work only while logged in and using args/context
      const userId = '61bf9b2e02dffb3e6460e3dd';
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedBooks: args } },
        { new: true }
      )

      return updatedUser;
    }
  }
};

module.exports = resolvers;