import { Document } from 'mongoose';

export interface UserSchema extends Document {
    username: string;
    password: string;
    roomid: string | null;
};