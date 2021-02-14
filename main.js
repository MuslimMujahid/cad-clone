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
    let square = [
        -0.5, 0.5,
        0.5, 0.5,
        0.5, -0.5,
        -0.5, -0.5,
    ]
    const squareObj = new GLObject(renderer.count, shader.program, gl);
    squareObj.setVertexArray(polygonTriangularity(square));
    squareObj.bind();
    renderer.addObject(squareObj);

    // render all object
    renderer.render();
}
main();
