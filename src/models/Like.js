import mongoose from 'mongoose';
import { profileSchema } from './Profile';

// THIS SCHEMA REPRESENTS ALL THE USERS WHOS LIKED ME
export const likeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId, // SO, THIS WILL BE ME USERID
  likers: [profileSchema]
});

const Like = mongoose.model('Like', likeSchema);

export default Like;
