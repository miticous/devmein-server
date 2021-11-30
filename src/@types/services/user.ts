import { User } from 'types/models/user';

export type RegisterUserParams = (params: { nickname: string; email: string }) => Promise<User>;
