let canvas = document.getElementById("c");
let ctx = canvas.getContext("2d", { alpha: false });
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;
let w2 = w/2 , h2 = h/2;
const {PI,sin,cos} = Math;
const PI2 = PI*2;

const slices = 50;
const mirror = true;

let img;
let pattern;
let offset = {x: 50, y: 10};
let patternStroke = "#41062e";

window.onclick = function() {
    offset.x = 0;
    offset.y = 0;
};
window.onresize = function() {
	w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    w2 = w/2;
    h2 = h/2;
};
window.onmousemove = function(e) {
	offset.x += img.width * (e.movementX / w);
	offset.y += img.height * (e.movementY / h);
};
function setup() {
	img = new Image();
	// img.src = "https://dl.dropboxusercontent.com/s/vd6jnmd2di62oxq/seamless-floral-skulls.png";
	img.src = "seamless-floral-skulls.png";
	img.onload = function() {
		pattern = ctx.createPattern(img, 'repeat');
		loop();
	};
}
function loop() {
    ctx.clearRect(0,0,w,h);
    
    let radius = w2 + h2;
    let deltaAngle = PI2 / slices;
    
    let x = [ -1, -1/*radius * sin(0)*/, radius * sin(deltaAngle), radius * sin(deltaAngle/2) ];
    let y = [ -1, radius/*radius * cos(0)*/, radius * cos(deltaAngle), radius * cos(deltaAngle/2) ];
    
	for(let i=0; i<slices; i++) {
        
        // draw the damn thing
        ctx.translate(w2, h2);
        ctx.rotate(i * deltaAngle);
        ctx.translate(offset.x, offset.y);
        ctx.beginPath();
        ctx.moveTo(x[0]-offset.x, y[0]-offset.y);
        ctx.lineTo(x[1]-offset.x, y[1]-offset.y);
        ctx.lineTo(x[2]-offset.x, y[2]-offset.y);
        ctx.lineTo(x[0]-offset.x, y[0]-offset.y);
        ctx.fillStyle = pattern;
        ctx.fill();
        ctx.resetTransform();

        if (mirror) {
            ctx.translate(w2, h2);
            
            ctx.rotate((i-1) * deltaAngle);
            ctx.scale(-1, 1);
            ctx.translate(offset.x, offset.y);

            ctx.beginPath();
            ctx.moveTo(x[0]-offset.x, y[0]-offset.y);
            ctx.lineTo(x[1]-offset.x, y[1]-offset.y);
            ctx.lineTo(x[3]-offset.x, y[3]-offset.y);
            ctx.lineTo(x[0]-offset.x, y[0]-offset.y);
            ctx.fillStyle = pattern;
            ctx.fill();
            
            ctx.resetTransform();
        }
	}
	offset.x = (offset.x + 0.75) % img.width;
    offset.y = (offset.y + 0.25) % img.height;

	// loop
	requestAnimationFrame(loop);
}
function drawDot(x, y, r=4, fillStyle="tomato") {
	ctx.beginPath();
	ctx.arc(x,y, r, 0, PI2);
	ctx.fillStyle = fillStyle;
	ctx.fill();
}

function rotate(x, y, a) {
    let newx = x*cos(a) - y*sin(a);
    let newy = x*sin(a) + y*cos(a);
    x = newx;
    y = newy;
    return {x, y};
}
setup();