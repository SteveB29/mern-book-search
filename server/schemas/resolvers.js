const { User } = require('../models');
// const { AuthenticationError } = require('apollo-server-express');
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
    }
  }
};

module.exports = resolvers;