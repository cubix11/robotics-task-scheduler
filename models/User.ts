import mongoose, { Schema } from 'mongoose';
import { UserSchema } from '../types';

const User: Schema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    roomid: {
        type: Schema.Types.Mixed
    }
});

export default mongoose.model<UserSchema>('User', User, 'users');