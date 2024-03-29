var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');

const sm = new StateManager();
const shader = new Shader(gl);
var color = [0.6,0.6,0.6];
var renderer;
var formLoadProject = document.getElementById("form-load-project");

async function main() {

    // main shader
    const vertShader = await loadShader("shaders/vertShader.glsl", gl.VERTEX_SHADER, gl);
    const fragShader = await loadShader("shaders/fragShader.glsl", gl.FRAGMENT_SHADER, gl);
    
    // select shader
    const selVertShader = await loadShader("shaders/selectVertShader.glsl", gl.VERTEX_SHADER, gl);
    const selFragShader = await loadShader("shaders/selectFragShader.glsl", gl.FRAGMENT_SHADER, gl);

    // generate shader
    const objShader = shader.program(vertShader, fragShader);
    const selShader = shader.program(selVertShader, selFragShader);

    // create renderer
    renderer = new Renderer(gl, objShader, selShader, SVGMaskElement);
    eventsListen(renderer, sm, gl, [objShader, selShader]);

    const line = new GLLine(renderer.objCount+1, objShader, selShader, gl);
    line.vertexArray = [100, 200, 200, 100, 100, 300];
    renderer.addObject(line);

    // defining texture buffer
    const texBuf = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texBuf);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // defining depth buffer
    const depBuf = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
    function setFrameBufferAttatchmentSizes(width, height) {
        gl.bindTexture(gl.TEXTURE_2D, texBuf);
        gl.texImage2D(gl.TEXTURE_2D, 0,gl.RGBA,width,
        height,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
        );
        gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf);
        gl.renderbufferStorage(
        gl.RENDERBUFFER,
        gl.DEPTH_COMPONENT16,
        width,
        height
        );
    }
    setFrameBufferAttatchmentSizes(gl.canvas.width, gl.canvas.height);

    // defining frame buffer
    const frameBuf = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);
    const attachmentPoint = gl.COLOR_ATTACHMENT0;
    const lvl = 0;

    // using the texture and depth buffer with frame buffer
    gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        attachmentPoint,
        gl.TEXTURE_2D,
        texBuf,
        lvl
    );
    gl.framebufferRenderbuffer(
        gl.FRAMEBUFFER,
        gl.DEPTH_ATTACHMENT,
        gl.RENDERBUFFER,
        depBuf
    );

    function render() {
        gl.clearColor(255, 255, 255, 255);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // drawing texture
        const frameBuffer = frameBuf;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

        // Depth Test
        gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderer.renderText();

        // getting the pixel value
        const data = new Uint8Array(4);
        gl.readPixels(sm.mouseX, sm.mouseY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
        sm.hover(id);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        // draw the actual objects
        renderer.render();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main();