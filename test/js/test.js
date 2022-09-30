function Point(x, y){
    const _x = x;
    const _y = y;
    this.x = function(){
        return _x;
    }
    this.y = function(){
        return _y;
    }
}

function angle(p1, p2){
    const a = Math.atan2(p1.y() - p2.y(), p1.x() - p2.x());
    return (a < 0) ? a + Math.PI*2 : a; 
}

function len(p1, p2){
    return Math.sqrt(Math.pow(p1.x() - p2.x(), 2) + Math.pow(p1.y() - p2.y(), 2)); 
}

function drawRectRecursive(ctx, p1, p2, coeff, coeff2, coeff3, d){
    if(d <= 0){
        return;
    }
    const a = angle(p1, p2);
    const l = len(p1, p2);
    const a2 = a + Math.PI/2;
    const p3 = new Point(p1.x() + Math.cos(a2)*l*coeff3, p1.y() + Math.sin(a2)*l*coeff3);
    const p4 = new Point(p2.x() + Math.cos(a2)*l*coeff3, p2.y() + Math.sin(a2)*l*coeff3);
    
    const p5 = new Point(
        (p3.x() - p4.x()) * coeff + p4.x(), 
        (p3.y() - p4.y()) * coeff + p4.y()
    );
    
    const p6 = new Point(p5.x() + Math.cos(a2)*l*coeff2, p5.y() + Math.sin(a2)*l*coeff2);
    
    ctx.beginPath();
    ctx.moveTo(p1.x(), p1.y());
    ctx.lineTo(p2.x(), p2.y());
    ctx.lineTo(p4.x(), p4.y());
    ctx.lineTo(p6.x(), p6.y());
    ctx.lineTo(p3.x(), p3.y());
    ctx.fill();    
    
    ctx.beginPath();
    ctx.moveTo(p1.x(), p1.y());
    ctx.lineTo(p2.x(), p2.y());
    ctx.lineTo(p4.x(), p4.y());
    ctx.lineTo(p6.x(), p6.y());
    ctx.lineTo(p3.x(), p3.y());
    ctx.stroke();
    
    drawRectRecursive(ctx, p3, p6, coeff, coeff2, coeff3, d-1);
    drawRectRecursive(ctx, p6, p4, coeff, coeff2, coeff3, d-1);
}

let canvas = document.getElementById("canvas");
canvas.width = 800;
canvas.height = 800;

function drawTree(ctx, x, y){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawRectRecursive(ctx, x, y, 0.6, 0.4, 2, 15);
}

let ctx = canvas.getContext("2d");
ctx.strokeStyle = "rgb(0, 100, 0)";
ctx.fillStyle = "rgb(0, 100, 0)";

let a = new Point(100, 100);
let b = new Point(100, 150);

drawTree(ctx, a, b);

let onmousedown = false;
document.onmousedown = function(evt){
    a = new Point(evt.clientX, evt.clientY);
    console.log("onmousedown", evt);
    onmousedown = true;
}

document.onmouseup = function(evt){
    onmousedown = false;
    b = new Point(evt.clientX, evt.clientY);
    console.log("onmouseup", evt);
    drawTree(ctx, a, b);
}

document.onmousemove = function(evt){
    if(onmousedown){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(a.x(), a.y(), 10, 0, Math.PI*2, true);
        ctx.arc(evt.clientX, evt.clientY, 10, 0, Math.PI*2, true);
        ctx.fill();
    }
} 
