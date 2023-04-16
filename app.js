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
    console.log(`Client ${client.id} connected`)

    client.on('disconnect', () => console.log(`Client ${client.id} has left`))
})