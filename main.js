var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, canvas.width,canvas.height);

const renderer = new Renderer(gl);
const shader = new Shader(gl);
var fiveSidedObj;
var color = [0.6,0.6,0.6];

async function main() {

    const vertShader = await loadShader("shaders/vertShader.glsl", gl.VERTEX_SHADER, gl);
    const fragShader = await loadShader("shaders/fragShader.glsl", gl.FRAGMENT_SHADER, gl);
    shader.attach(vertShader);
    shader.attach(fragShader);
    shader.link();

    // try to to draw an object
    // do this if you want to draw an object
    let fiveSided = [
        -0.2, 0.2,
        0.1, 0.5,
        0.2, 0.2,
        0.2, -0.2,
        -0.2, -0.2,
    ]
    fiveSidedObj = new GLObject(renderer.count, shader.program, gl);
    fiveSidedObj.setVertexArray(polygonTriangularity(fiveSided));
    fiveSidedObj.translate(0.4, 0.1);
    fiveSidedObj.scale(0.3);
    fiveSidedObj.rotate(30);
    fiveSidedObj.setColor(...color,1);
    fiveSidedObj.bind();
    renderer.addObject(fiveSidedObj);

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
    fiveSidedObj.setColor(mapValue(x, 0, 255, 0, 1),mapValue(y, 0, 255, 0, 1),mapValue(z, 0, 255, 0, 1),1);
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