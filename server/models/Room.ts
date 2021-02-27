import mongoose, { Schema } from 'mongoose';
import { RoomSchema } from '../types';

const Room: Schema = new Schema({
    name: {
        type: String,
        required: true
    }
});

export default mongoose.model<RoomSchema>('Room', Room, 'rooms');