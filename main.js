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
    let vertices = [
        -0.1, 0.1,		       
        0.1, 0.1,		     
        0.1, -0.1,		       
        -0.1, -0.1,
    ]
    const square = new GLObject(renderer.objCount, shader.program, gl);
    square.setVertexArray(polygonTriangularity(vertices));
    square.translate(-0.5, 0.4);
    square.scale(2, 1);
    square.rotate(60);
    square.setColor(1,0.1,0,1);
    square.bind();
    renderer.addObject(square);

    // render all object
    renderer.render();
}
main();
