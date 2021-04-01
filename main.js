var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');

const sm = new StateManager();
const shader = new Shader(gl);
var color = [0.6,0.6,0.6];

var formLoadProject = document.getElementById("form-load-project");

async function main() {

    canvas.onmousemove = function(e) {
        sm.prevMouseX = sm.mouseX;
        sm.prevMouseY = sm.mouseY;
        sm.mouseX = e.clientX * gl.canvas.width / canvas.clientWidth;  
        sm.mouseY = gl.canvas.height - e.clientY * gl.canvas.height / canvas.clientHeight - 1;  
    };

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
    const renderer = new Renderer(gl, objShader, selShader, SVGMaskElement);

    // try to to draw an object
    // do this if you want to draw an object
    let vertices = [
        300, 500,		       
        500, 500,		     
        500, 300,		       
        300, 300,
    ]
    square = new GLObject(objShader, selShader, gl);
    square.Origin(100, 100);
    // square.setVertexArray(vertices);
    square.Translate(200, 0);
    square.Scale(10, 20);
    // console.log(square.matTranslation);
    renderer.addObject(square);

    // Some... texture stuffs
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

    //
    // DEBUG CALLS HERE
    //

    // drawDebugObjects(shaderProgram);

    //
    // END DEBUG CALLS
    //

    function render(now) {
        gl.clearColor(255, 255, 255, 255);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        // drawing texture
        const frameBuffer = frameBuf;
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

        // Depth Test
        // gl.enable(gl.DEPTH_TEST);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // gl.useProgram(selectProgram);
        // const resolutionPos = gl.getUniformLocation(selectProgram, "u_resolution");
        // gl.uniform2f(resolutionPos, gl.canvas.width, gl.canvas.height);
        // renderer.renderTex(selectProgram);
        // draggerRenderer.renderTex(selectProgram);

        // getting the pixel value
        // const pixelX = (appState.mousePos.x * gl.canvas.width) / canvas.clientWidth;
        // const pixelY =
        //   gl.canvas.height -
        //   (appState.mousePos.y * gl.canvas.height) / canvas.clientHeight -
        //   1;
        // const data = new Uint8Array(4);
        // gl.readPixels(pixelX, pixelY, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, data);
        // const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
        // appState.selId = id;

        // showObjId(id, "hov-id");

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        // draw the actual objects
        // gl.useProgram(shaderProgram);
        renderer.render();
        // draggerRenderer.render();
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}
main();