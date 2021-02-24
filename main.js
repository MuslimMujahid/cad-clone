var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);

const renderer = new Renderer(gl);
const shader = new Shader(gl);
var square;
var color = [0.6,0.6,0.6];

function getMouse(e) {
    return {
        x: e.clientX-Canvas.left,
        y: window.innerHeight-e.clientY-(window.innerHeight-Canvas.bottom)
    }
}

async function main() {

    const vertShader = await loadShader("shaders/vertShader.glsl", gl.VERTEX_SHADER, gl);
    const fragShader = await loadShader("shaders/fragShader.glsl", gl.FRAGMENT_SHADER, gl);
    shader.attach(vertShader);
    shader.attach(fragShader);
    shader.link();
    gl.useProgram(shader.program);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const u_resolution = gl.getUniformLocation(shader.program, 'u_resolution');
    gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);

    // try to to draw an object
    // do this if you want to draw an object
    let vertices = [
        200, 400,		       
        400, 400,		     
        400, 200,		       
        200, 200,
    ]
    square = new GLObject(renderer.objCount, shader.program, gl);
    square.setVertexArray(polygonTriangularity(vertices));
    square.translate(0, 0);
    // square.scale(1, .2);
    // square.rotate(30);
    square.setColor(1,0.1,0,1);
    square.bind();
    renderer.addObject(square);

    // render all object
    renderer.render();
}
main();

var addEventForChangeColor = (item) => {
    item.forEach(element => {
       element.addEventListener('click', setColor) 
    });
}

function setColor(){
    [x,y,z] = getColor(event.srcElement.style.backgroundColor)
    square.setColor(mapValue(x, 0, 255, 0, 1),mapValue(y, 0, 255, 0, 1),mapValue(z, 0, 255, 0, 1),1);
    renderer.render();
}

window.onload = () => {
    addEventForChangeColor([...document.getElementsByClassName("color")])
}

function mapValue(value, min1, max1, min2, max2) {
    return (value*(max2-min2) - max2*min1 + min2*max1)/(max1-min1)
}

function getColor(value) {
    var x = value.split("rgb")[1].split(", ")
    var r = parseInt(x[0].substr(1)),
        g = parseInt(x[1]),
        b = parseInt(x[2].slice(0,x[2].length-1));
    return [r,g,b]
}