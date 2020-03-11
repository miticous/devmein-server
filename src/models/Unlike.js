import mongoose from 'mongoose';

export const unlikeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  unlikes: [
    {
      _id: mongoose.Schema.Types.ObjectId
    }
  ]
});

const Unlike = mongoose.model('Unlike', unlikeSchema);

export default Unlike;
