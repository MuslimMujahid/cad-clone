var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');
gl.enable(gl.DEPTH_TEST);
gl.viewport(0, 0, canvas.width,canvas.height);

const renderer = new Renderer(gl);
const shader = new Shader(gl);

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
    const fiveSidedObj = new GLObject(renderer.count, shader.program, gl);
    fiveSidedObj.setVertexArray(polygonTriangularity(fiveSided));
    fiveSidedObj.translate(0.4, 0.1);
    fiveSidedObj.scale(0.3);
    fiveSidedObj.rotate(30);
    fiveSidedObj.setColor(1,0.1,0,1);
    fiveSidedObj.bind();
    renderer.addObject(fiveSidedObj);

    // render all object
    renderer.render();
}
main();
