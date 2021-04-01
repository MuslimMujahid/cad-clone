var canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl');

const stateManager = new StateManager();
const shader = new Shader(gl);
var color = [0.6,0.6,0.6];

var formLoadProject = document.getElementById("form-load-project");

async function main() {

    canvas.onmousemove = function(e) {
        stateManager.prevMouseX = stateManager.mouseX;
        stateManager.prevMouseY = stateManager.mouseY;
        stateManager.mouseX = e.clientX * gl.canvas.width / canvas.clientWidth;  
        stateManager.mouseY = gl.canvas.height - e.clientY * gl.canvas.height / canvas.clientHeight - 1;  
    
        if (stateManager.selectedObject) {
            const deltaX = stateManager.mouseX-stateManager.prevMouseX;
            const deltaY = stateManager.mouseY-stateManager.prevMouseY;

            stateManager.selectedObject.translate(deltaX, deltaY);
        }
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
    const renderer = new Renderer(gl, objShader, selShader, stateManager);

    
    document.querySelector("#create-square").onclick = function() {
        let vertices = [
            300, 500,		       
            500, 500,		     
            500, 300,		       
            300, 300,
        ]
        const square = new GLObject(
            renderer.objCount, 
            objShader, 
            selShader, 
            gl
        );
        square.setVertexArray(polygonTriangularity(vertices));
        renderer.addObject(square);
    }
    document.querySelector("#create-triangle").onclick = function() {
        let vertices = [
            300, 500,		       
            500, 500,		     
            500, 300
        ]
        const triangle = new GLObject(
            renderer.objCount, 
            objShader, 
            selShader, 
            gl
        );
        triangle.setVertexArray(polygonTriangularity(vertices));
        renderer.addObject(triangle);
    }

    // try to to draw an object
    // do this if you want to draw an object
    let vertices = [
        300, 500,		       
        500, 500,		     
        500, 300,		       
        300, 300,
    ]
    square = new GLObject(
        renderer.objCount, 
        objShader, 
        selShader, 
        gl
    );
    square.setVertexArray(polygonTriangularity(vertices));
    renderer.addObject(square);

    canvas.onclick = function(e) {
        const data = stateManager.color;
        const selectedObj = renderer.objList.find(obj => 
            mapValue(obj.color[0], 0, 1, 0, 255) == data[0] &&
            mapValue(obj.color[1], 0, 1, 0, 255) == data[1] &&
            mapValue(obj.color[2], 0, 1, 0, 255) == data[2]
        );
        console.log(renderer.objList[0].color.map(val => mapValue(val, 0, 1, 0, 255)));
        console.log(data);
        console.log(selectedObj);
        

        if (selectedObj) {
            if (!stateManager.selectedObject) {
                stateManager.selectedObject = selectedObj;
            } else {
                const color = stateManager.selectedObject.color;
                if (color[0] == selectedObj.color[0] &&
                    color[1] == selectedObj.color[1] &&
                    color[2] == selectedObj.color[2])
                {
                    stateManager.selectedObject = null;
                } else {
                    stateManager.selectedObject = selectedObj;
                }
            }
        }

        // if (!stateManager.selectedObject) {
        //     stateManager.selectedObject = renderer.objList[0];
        // } else {
        //     stateManager.selectedObject = null;
        // } 
    }

    let vertices2 = [
        500, 550,
        550, 550,
        550, 500,
        500, 500
    ]
    square2 = new GLObject(
        renderer.objCount, 
        objShader, 
        selShader, 
        gl
    );
    square2.setVertexArray(polygonTriangularity(vertices2));
    renderer.addObject(square2);

    // render all object
    renderer.render();

    // ====================================================================



    // create texture buffer
    const textureBuffer = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    // create depth buffer
    const depthBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height);
    
    // create frame buffer
    const frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    const attachment_point = gl.COLOR_ATTACHMENT0;
    const lvl = 0;
    
    gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment_point, gl.TEXTURE_2D, textureBuffer, lvl);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);


    function render() {
        gl.clearColor(1, 1, 1, 1);
        
        // use selection program
        gl.useProgram(selShader);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        gl.enable(gl.DEPTH_TEST);

        // render select
        renderer.renderTexture();
        renderer.render();

        // pick a pixel by mouse position
        let data = new Uint8Array(4); // RGBA values for each pixel
        gl.readPixels(stateManager.mouseX, stateManager.mouseY, 1 ,1 ,gl.RGBA , gl.UNSIGNED_BYTE, data);
        stateManager.color = data;
        // const [red, green, blue] = [
        //     gl.RED_BITS, gl.GREEN_BITS, 
        //     gl.BLUE_BITS].map(bits => gl.getParameter(bits));
        
        // console.log(stateManager.mouseX, stateManager.mouseY);
        // console.log(red, green, blue);        
        const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24)
        // console.log(data)
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        
        // draw
        gl.useProgram(objShader);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        renderer.render();
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // =======================================
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

async function loadProject() {
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
    const renderer = new Renderer(gl, objShader, selShader, stateManager);
    
    if(document.getElementById('file').value !== "")
    {
        let path = (window.URL || window.webkitURL).createObjectURL(document.getElementById('file').files[0]);
        await initProjectFile(gl, objShader, selShader, path, renderer);
    }
}