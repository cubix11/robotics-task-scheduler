import { Document } from 'mongoose';

export interface UserSchema extends Document {
    username: string;
    password: string;
    roomid: string | null;
};

export interface ResponseError {
    error: string;
    stack?: string | undefined;
};

export interface UserInput {
    username: string;
    password: string;
};