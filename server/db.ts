import mongoose from 'mongoose';
import env from './dotenv';

mongoose.connect(env.MONGO_URI!, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err: mongoose.CallbackError): void => console.log(err || 'Connected!'));

export default '';