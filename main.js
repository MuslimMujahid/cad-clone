var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);

const stateManager = new StateManager();
const renderer = new Renderer(gl, stateManager);
const shader = new Shader(gl);
var color = [0.6,0.6,0.6];

async function main() {
    // main shader
    const vertShader = await loadShader("shaders/vertShader.glsl", gl.VERTEX_SHADER, gl);
    const fragShader = await loadShader("shaders/fragShader.glsl", gl.FRAGMENT_SHADER, gl);
    
    // select shader
    const selVertShader = await loadShader("shaders/selectVertShader.glsl", gl.VERTEX_SHADER, gl);
    const selFragShader = await loadShader("shaders/selectFragShader.glsl", gl.FRAGMENT_SHADER, gl);

    // try to to draw an object
    // do this if you want to draw an object
    let vertices = [
        200, 400,		       
        400, 400,		     
        400, 200,		       
        200, 200,
    ]
    square = new GLObject(
        renderer.objCount, 
        shader.program(vertShader, fragShader), 
        shader.program(selVertShader, selFragShader), 
        gl
    );
    square.setVertexArray(polygonTriangularity(vertices));
    square.setColor(1,0,1,1);
    renderer.addObject(square);

    let vertices2 = [
        500, 550,
        550, 550,
        550, 500,
        500, 500
    ]
    square2 = new GLObject(
        renderer.objCount, 
        shader.program(vertShader, fragShader), 
        shader.program(selVertShader, selFragShader), 
        gl
    );
    square2.setVertexArray(polygonTriangularity(vertices2));
    square2.setColor(0,0,0,1);
    renderer.addObject(square2);

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
    [x,y,z] = getColor(Event.target.style.backgroundColor)
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