const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

const port = process.env.PORT || 3000;

io.on('connection', socket => {
  console.log(`Client ${socket.id} connected.`);

  socket.on('mouse', (data) => socket.broadcast.emit('mouse', data));
  socket.on('clear', () => socket.broadcast.emit('clear'));
  socket.on('disconnect', () => console.log(`Client ${socket.id} has disconnected`))
});

http.listen(port, () => {
  console.log(`listening on ${port}`);
});
