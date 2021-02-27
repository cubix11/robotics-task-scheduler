import mongoose, { Schema } from 'mongoose';
import { TaskSchema } from '../types';

const Task: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    roomid: {
        type: String,
        required: true
    }
});

export default mongoose.model<TaskSchema>('Task', Task, 'tasks');