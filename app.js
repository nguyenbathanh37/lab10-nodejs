require('dotenv').config()
const express = require('express')
const socketio = require('socket.io')

const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/chat', (req, res) => {
    res.render('chat')
})

const port = process.env.PORT || 8080 
const httpServer = app.listen(port, () => console.log('http://localhost:' + port))
const io = socketio(httpServer)

io.on('connection', client => {
    console.log(`Client ${client.id} đã kết nối`)

    client.free = true
    client.loginAt = new Date().toLocaleTimeString()

    client.on('disconnect', () => {
        console.log(`Client ${client.id} đã thoát`)

        // thông báo cho tất cả các user còn lại trước khi mình thoát
        client.broadcast.emit('user-leave', client.id)
    })

    client.on('register-name', username => {
        client.username = username
        // gửi thông tin đăng ký cho tất cả user còn lại
        client.broadcast.emit('register-name', {id: client.id, username: username})
    })
    // gửi danh sách user đang online cho người mới
    client.emit('list-users', Array.from(io.sockets.sockets.values())
    .map(socket => ({id: socket.id, username: socket.username, free: socket.free, loginAt: socket.loginAt})))
    // gửi thông tin người mới cho toàn bộ người cũ
    client.broadcast.emit('new-users', {id: client.id, username: client.username, free: client.free, loginAt: client.loginAt})
})