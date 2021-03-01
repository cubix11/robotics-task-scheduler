const socket = io.connect('ws://localhost:3000');

socket.emit('join-room', '603c5fc046f35f39f0e61c00')
