import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import 'dotenv/config';
import { Server } from 'socket.io';

const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        console.log(data);
        socket.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log('Server running on http://localhost:3001');
});
