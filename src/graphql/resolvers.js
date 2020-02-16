import { createProfile } from '../services/profile';

const resolvers = {
  Query: {
    // uploads: (parent, args) => {}
  },
  Mutation: {
    createProfile: async (root, args, context) => {
      await createProfile({ authorization: context.authorization, ...args });
    }
  }
};

export default resolvers;
