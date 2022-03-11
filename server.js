const {Server} = require('socket.io');
const express = require('express');
const app = express();

const server =app.listen(3000);
const connections =[];
const players = [];
let ball;

//Player
function Player(id,x,y,v,w,h,p){
    this.id = id;
    this.x = x;
    this.y = y;
    this.v = v;
    this.w = w;
    this.h = h;
    this.p = p;
}

//Ball
function Ball(id,x,y,xv,yv,r){
    this.id = id;
    this.x = x;
    this.y = y;
    this.xv = xv;
    this.yv = yv;
    this.r = r;
}

//hosting clients
app.use(express.static('public'));
console.log("RUNNING");

const io = new Server(server);

function getCounter(){
    io.sockets.emit('getCounter',connections.length);
}
//function update
function heartBeat(){
    io.sockets.emit('heartBeat',players);
}
setInterval(heartBeatBall,33);
//function update
function heartBeatBall(){
    io.sockets.emit('heartBeatBall',ball);
}
setInterval(heartBeat,33);

io.on("connection", (socket)=>{
    connections.push(socket);
    getCounter();

    //start player
    socket.on("start", (data)=>{
        console.log("user connected "+socket.id+" #: "+connections.length);
        let p = new Player(socket.id,data.x,data.y,data.w,data.h,data.p);
        players.push(p);
    });

    //start ball
    socket.on("startball", (data)=>{
        ball = new Ball(socket.id,data.x,data.y,data.xv,data.yv,data.r);
    });

    //update player
    socket.on('update',(data)=>{
        let play;
        for (let i=0;i<players.length;i++){
            if(socket.id === players[i].id){
                play = players[i];
            }
        }
        play.x = data.x;
        play.y = data.y;
        play.v = data.v;
        play.w = data.w;
        play.h = data.h;
        play.p = data.p;
    });
//update ball
    socket.on('updateball',(data)=>{
        ball.x = data.x;
        ball.y = data.y;
        ball.xv = data.xv;
        ball.yv = data.yv;
        ball.r = data.r;
    });

});

