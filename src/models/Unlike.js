import mongoose from 'mongoose';

export const unlikeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  unlikes: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      type: {
        type: String,
        enum: ['LOVE', 'FRIENDSHIP', 'BOTH'],
        required: true
      }
    }
  ]
});

const Unlike = mongoose.model('Unlike', unlikeSchema);

export default Unlike;
