import mongoose from 'mongoose';
import { SearchConfig } from 'types/common';

export interface UserConfigs {
  maxDistance: number;
  love: SearchConfig;
  friendShip: SearchConfig;
}

export interface User {
  _id: mongoose.Types.ObjectId;
  email: string;
  githubId: string;
  token: string;
  profileStatus: 'PENDING' | 'CREATION' | 'COMPLETED';
  configs: UserConfigs;
  // TODO
  // plan: {
  //   type: string;
  //   enum: ['MERCURIO', 'JUPITER'];
  //   default: 'MERCURIO';
  //   required: true;
  // };
}
