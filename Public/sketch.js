let p;
let b;
let socket;
let balls = [];
let players = [];
let lastPos;
let go = false;
let counter = 0;

function setup(){
    socket =  io.connect("http://localhost:3000")
    createCanvas(750,600);
    b = new Ball();


    socket.on('getCounter',(data)=>{
        counter = data;
        if(p === undefined){
            if(counter %2 === 0){
                p =  new Player(0);
            }else {
                p = new Player(width);
            }
        }
          data = {
            x:p.x,
            y:p.y,
            v:p.v,
            w:p.w,
            h:p.h,
            p:p.p
        };
        socket.emit('start',data);

        data = {
            x:b.x,
            y:b.y,
            xv:b.xv,
            yv:b.yv,
            r:b.r
        };
        socket.emit('startball',data);

        if(counter === 2){
            go = true;
        }
    });


    socket.on('heartBeat',(data)=>{
        players = data;
    });

    socket.on('heartBeatBall',(data)=>{
        if(data !== null) {
            b.x = data.x;
            b.y = data.y;
            b.xv = data.xv;
            b.yv = data.yv;
            b.r = data.r;
        }
    });

}

function draw(){
    background(0);
    rect(width/2,0,10,600)
    textSize(48);
    fill(0, 102, 153);
    if(go === true) {
        showPoints(players);
        p.show();
        p.move(b);
        b.show();
        b.move();

        //Collisions
        if (b.collision(p) && p.x===0)
            b.xv = 5;
        if(b.collision(p) && p.x ===width)
          b.xv = -5;
        if(b.x < 0){
          throwBall();
            if(p.x === width) {
                p.p++;
            }
        }
        if (b.x > width) {
            throwBall();
            if(p.x === 0) {
                p.p++;
            }
        }

        for (let i = 0; i < players.length; i++) {
            let id = players[i].id;
            if (id != socket.id) {
                fill(255, 0, 0);
                rectMode(CENTER);
                rect(players[i].x, players[i].y, players[i].w, players[i].h);
            }
        }
        let data = {
            x: p.x,
            y: p.y,
            v: p.v,
            w: p.w,
            h: p.h,
            p: p.p
        };
        socket.emit('update', data);

          data1 = {
            x: b.x,
            y: b.y,
            xv: b.xv,
            yv: b.yv,
            r: b.r
        };
        socket.emit('updateball', data1);

   }
}
//Reset ball
function throwBall(){
    b.x = width/2;
    b.y = height/2;
}

function showPoints(p){
    textSize(80);
    fill(0, 102, 153);
    for(let i = 0; i < p.length; i++) {
        if (p[i].points !== undefined) {
            if (p[i].x === 0)
                text(p[i].points.toString(), width / 2 - 100, height - 100);
            else
                text(p[i].points.toString(), width / 2 + 100, height - 100);
        }
    }
}

