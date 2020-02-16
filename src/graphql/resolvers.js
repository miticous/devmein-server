import { createProfile } from '../services/profile';

const resolvers = {
  Query: {
    // uploads: (parent, args) => {}
  },
  Mutation: {
    createProfile: async (root, args, context) => {
      const fileArgs = await args.file;

      await createProfile({ authorization: context.authorization, ...args, ...fileArgs });
    }
  }
};

export default resolvers;
