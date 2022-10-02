
function random(min,max){
  return Math.floor(Math.random()*(max-min+1)+min);
}
var canvas = document.getElementById("canvas");

var ctx = canvas.getContext("2d");



function rad(grad){
  return grad*(Math.PI*2)/360;
}

function Circle(x, y, r, direction, speed, color){
  var _x = x;
  var _y = y;
  var _r = r;
  var _speedX = 0.01*speed*Math.cos(rad(direction));
  var _speedY = 0.01*speed*Math.sin(rad(direction));
  var _color = color;
  this.next = function(){
      _x+=_speedX;
      _y+=_speedY;
      
      if(_x < 0){
	_x = canvas.width+_x;
      }
      if(_y < 0){
	_y = canvas.height+_y;
      }
      if(_x > canvas.width){
	_x = 0+_x-canvas.width;
      }
      if(_y > canvas.height){
	_y = 0+_y-canvas.height;
      }
  }
  this.draw = function(){
	ctx.fillStyle = _color;
	ctx.beginPath();
	ctx.arc(_x, _y, _r, 0, Math.PI*2, true);
	ctx.fill();
	if(_x-_r < 0){
	  ctx.beginPath();
	  ctx.arc(_x+canvas.width, _y, _r, 0, Math.PI*2, true);
	  ctx.fill();
	}
	if(_y-_r < 0){
	  ctx.beginPath();
	  ctx.arc(_x, _y+canvas.height, _r, 0, Math.PI*2, true);
	  ctx.fill();
	}
	if(_x+_r > canvas.width){
	  ctx.beginPath();
	  ctx.arc(_x-canvas.width, _y, _r, 0, Math.PI*2, true);
	  ctx.fill();
	}
	if(_y+_r > canvas.height){
	  ctx.beginPath();
	  ctx.arc(_x, _y-canvas.height, _r, 0, Math.PI*2, true);
	  ctx.fill();
	}
  }
}

function getCmd(id){
  var f = document.getElementById(id).value;
  f = f.replace(/"/g, "\\\"");
  return "result = "+f+";";
}

function getCount(){
  return document.getElementById("count").value;
}

var COUNT;
var GRID_M = 0;
var GRID_N = 0;

var arcs = new Array();

function getDirection(i){
  var result;
  eval(getCmd("direction"));
  return result;
}
function getSpeed(i){
  var result;
  eval(getCmd("speed"));
  return result;
}
function getRadius(i){
  var result;
  eval(getCmd("radius"));
  
  if(result < 0){
    throw {message: "Радиус должен быть больше 0"};
  }
  return result;
}
function getPosX(i){
  return (i%GRID_M)*(canvas.width/GRID_M) + (canvas.width/(GRID_M))/2;
}
function getPosY(i){
  return Math.floor(i/GRID_M)*(canvas.height/(GRID_N)) + (canvas.height/(GRID_N))/2;
}
function assertColor(color){
  if(color < 0 || 255 < color){
    throw {message: "Цвет должен быть от 0 до 255"};
  }
}
function getColor(i){
  return "rgb("+random(0, 255)+", "+random(0, 255)+", "+random(0, 255)+")";
}

function update(){
  try{
    canvas.width = document.getElementById("page").offsetWidth;
    canvas.height = document.getElementById("page").offsetHeight;
    updateDrid();
    COUNT = getCount();
    arcs.length = 0;
    for(var i=0; i<COUNT; ++i){
      arcs.push(new Circle(
	getPosX(i),
	getPosY(i),
	getRadius(i),
	getDirection(i),
	getSpeed(i), 
	getColor(i)
      ));
    }
  }catch(err){
    alert("Произошла ошибка: "+err.message);
  }
}

function updateDrid(){
  var count = getCount();
  var w = canvas.width;
  var h = canvas.height;
  var ratio = 1;
  if(w > h){
    ratio = Math.round(w/h);
    GRID_N = Math.round(Math.sqrt(count/ratio));
    GRID_M = GRID_N*ratio;
  }else{
    ratio = Math.round(h/w);
    GRID_M = Math.round(Math.sqrt(count/ratio));
    GRID_N = GRID_M*ratio;
  }
  clearCount();
  fillCount(ratio);
  document.getElementById("count").value = GRID_N*GRID_M;
}
var templates = {
  "template1": function(){
    document.getElementById("direction").value = "random(0, 360)";
    document.getElementById("speed").value = "500";
  },
  "template2": function(){
    document.getElementById("direction").value = "90";
    document.getElementById("speed").value = "500";
  },
  "template3": function(){
    document.getElementById("direction").value = "270";
    document.getElementById("speed").value = "500";
  },
  "template4": function(){
    document.getElementById("direction").value = "0";
    document.getElementById("speed").value = "500";
  },
  "template5": function(){
    document.getElementById("direction").value = "180";
    document.getElementById("speed").value = "500";
  },
  "template6": function(){
    document.getElementById("direction").value = "0";
    document.getElementById("speed").value = "Math.floor(i/GRID_M)*(1500-200)/GRID_N+200";
  },
  "template7": function(){
    document.getElementById("direction").value = "45";
    document.getElementById("speed").value = "500";
  },
  "template8": function(){
    document.getElementById("direction").value = "(i%GRID_M)%2?45:-45";
    document.getElementById("speed").value = "500";
  },
  "template9": function(){
    document.getElementById("direction").value = "Math.floor(i/GRID_M)%2?45:135";
    document.getElementById("speed").value = "500";
  } 
}

function clearCount(){
  var countList = window.document.getElementById("count");
  var opts = countList.options;
  while(opts.length > 0){
    opts[0] = null;
  }
}
function fillCount(ratio){
  var countList = window.document.getElementById("count");
  var idx = 0;
  for(var i=1; i<30; ++i){
    var count = i*i*ratio;
    var option=document.createElement('option');
    option.value = count;
    option.text = count;
    countList.options[idx++] = option;
  }
}

function changedTemplate(){
  var cookies = new Cookies();
  var template = cookies.add("current_template", document.getElementById("template").value);
  templateFromCookie();
}
function templateFromCookie(){
  var cookies = new Cookies();
  var template = cookies.get("current_template");
  if(template){
    document.getElementById("template").value = template;
  }else{
    template = document.getElementById("template").value;
  }
  templates[template]();
  update();
}

window.onresize = function(e){
  canvas.width = 0;
  canvas.height = 0;
  update();
}

function drawAll(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i=0; i<arcs.length; ++i){
    arcs[i].next();
  }
  for(var i=0; i<arcs.length; ++i){
    arcs[i].draw();
  }
}

function timer(){
  drawAll();
  setTimeout(timer, 30);
}

timer(); 
templateFromCookie();
