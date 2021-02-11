/*======= Creating a canvas =========*/
var canvas = document.querySelector('canvas');

/*======= Global variables =========*/

var shapes = {
    verticeRange: [(0, 3)],
    vertices: [
        -0.7,-0.1,0,
        -0.3,0.6,0,
        -0.3,-0.3,0
    ]
}

/*======= Controller =========*/

const mapXY = (x, y, mode) => {

    const Canvas = canvas.getBoundingClientRect()
    if (mode === 'to webgl') {
        const glX = (x-Canvas.left)*100/Canvas.width
        const glY = (Canvas.height-(y-Canvas.top))*100/Canvas.height

        return {
            x: glX,
            y: glY
        }
    } else if (mode === 'to window') {
        const windowX = (Canvas.width*x/100) + Canvas.left
        const windowY = Canvas.height + Canvas.top - (Canvas.height*y/100)
    
        return {
            x: windowX,
            y: windowY
        }
    }
}

document.onclick = (e) => {
    const Canvas = document
        .querySelector('canvas')
        .getBoundingClientRect()
    
    // only cintinue if mouse click performed in the canvas
    if (!(e.clientX >= Canvas.left &&
        e.clientX <= Canvas.right &&
        e.clientY >= Canvas.top &&
        e.clientY <= Canvas.bottom)) {
        
        // if click in a plane
        return
    }

    console.log(e.clientX, e.clientY)
    const glP = mapXY(e.clientX, e.clientY, 'to webgl')
    console.log(glP.x, glP.y)
    const windowP = mapXY(glP.x, glP.y, 'to window')
    console.log(windowP.x, windowP.y)
}




// webgl context
var gl = canvas.getContext('webgl');

// Create an empty buffer object
var vertex_buffer = gl.createBuffer();

// Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapes.vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

/*=================== Shaders ====================*/

// Vertex shader source code
var vertCode =
'attribute vec3 coordinates;' +
'void main(void) {' +
    ' gl_Position = vec4(coordinates, 1.0);' +
'}';

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// Fragment shader source code
var fragCode =
'void main(void) {' +
    'gl_FragColor = vec4(0.0, 0.0, 0.0, .2);' +
'}';

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both the programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======= Associating shaders to buffer objects ======*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(coord);

/*============ Drawing the triangle =============*/

// Clear the canvas
gl.clearColor(1, 1, 1, 1);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

// Clear the color and depth buffer
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
gl.drawArrays(gl.TRIANGLES, 0, 6);





