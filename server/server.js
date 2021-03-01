"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const user_1 = __importDefault(require("./routes/user"));
const room_1 = __importDefault(require("./routes/room"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const schema_1 = require("./schema");
const Task_1 = __importDefault(require("./models/Task"));
db_1.default;
const app = express_1.default();
const PORT = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/user', user_1.default);
app.use('/room', room_1.default);
app.use('/task', tasks_1.default);
app.use('/', (req, res) => res.sendFile(path_1.default.join(__dirname, 'views', 'index.html')));
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
            socket.emit('create-task-error', new Error(valid.error.details[0].message));
            return;
        }
        ;
        const insertedTask = await (new Task_1.default({
            name: task.name,
            roomid: task.roomid
        })).save();
        io.to(task.roomid).emit('create-task', insertedTask._id);
    });
});
console.log('Server listening on port', PORT);
server.listen(3000);
