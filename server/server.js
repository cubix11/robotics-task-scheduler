"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_1 = __importDefault(require("./routes/user"));
const room_1 = __importDefault(require("./routes/room"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("./schema");
const Task_1 = __importDefault(require("./models/Task"));
const volleyball_1 = __importDefault(require("volleyball"));
db_1.default;
const app = express_1.default();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
app.use(express_1.default.json());
app.use(volleyball_1.default);
app.set('view engine', 'ejs');
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/user', user_1.default);
app.use('/room', room_1.default);
app.use('/login', (req, res) => res.sendFile(path_1.default.join(__dirname, 'views', 'login.html')));
app.use('/home', (req, res) => res.sendFile(path_1.default.join(__dirname, 'views', 'index.html')));
app.use('/signup', (req, res) => res.sendFile(path_1.default.join(__dirname, 'views', 'signup.html')));
app.use(errorHandler);
function errorHandler(error, req, res, next) {
    res.statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const response = {
        message: error.message
    };
    if (!process.env.NODE_ENV)
        response.stack = error.stack;
    res.json(response);
}
;
// Socket events
io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('join-room', (id) => socket.join(id));
    socket.on('create-task', async (task) => {
        const valid = schema_1.taskSchema.validate(task);
        if (valid.error) {
            socket.emit('create-task', { error: valid.error.details[0].message });
            return;
        }
        ;
        const insertedTask = await (new Task_1.default({
            name: task.name,
            roomid: task.roomid
        })).save();
        io.to(task.roomid).emit('create-task', { id: insertedTask._id, name: insertedTask.name });
    });
    socket.on('edit-task', async (roomid, newTask) => {
        const valid = schema_1.taskSchema.validate({ roomid, name: newTask.name });
        if (valid.error) {
            socket.emit('edit-task', { error: valid.error.details[0].message });
            return;
        }
        ;
        await Task_1.default.findByIdAndUpdate(newTask.id, { name: newTask.name });
        io.to(roomid).emit('edit-task', { id: newTask.id, name: newTask.name });
    });
    socket.on('delete-task', async (roomid, id) => {
        await Task_1.default.findByIdAndDelete(id);
        io.to(roomid).emit('delete-task', id);
    });
});
console.log('Server listening on port', PORT);
server.listen(3000);
