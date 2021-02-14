/*======= Creating a canvas =========*/
var canvas = document.querySelector('canvas');

/*======= Global variables =========*/

const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

const point = (x, y) => {
    return {x: x, y: y}
}

var shapes = {
    type: 'polygon',
    points: [
        {
            prevPoints: [
                point(-0.5, 0.5),
                point(0.5, 0.5),
                point(0.5, -0.5),
                point(-0.5, -0.5)
            ],
            curPoints: [
                point(0.5, -0.5),
                point(0.3, -0.5),
                point(0.1, -0.3),
                point(0.1, 0.2),
                point(0.3, 0.4),
                point(0.5, 0.4),
                point(0.3, 0.2),
                point(0.3, -0.1),
                point(0.4, -0.2),
                point(0.7, -0.2),
            ]
        }
    ]
}

const stateType = {
    SELECT: 'select', // default
    DRAWING: 'drawing', // selected a shape to draw
    SELECTING: 'selecting' // selected a object in canvas
}

const createSelectState = () => {
    return {
        type: stateType.SELECT
    }
}

const createSelectedState = (shape) => {
    return {
        type: stateType.SELECTING,
        shape: shape
    }
}

const createDrawingState = (shape) => {
    return {
        type: stateType.DRAWING,
        shape: shape
    }
}

var shapeItems = []

/*======= Controller =========*/
const generateCoordinatesForShader = (points) => {
    let newPoints = []

    for (let i = 0; i < points.length-1; i += 1) {
        if (i+1 == points.length-i-1) continue


        let triangle = [points[i], points[i+1], points[points.length-i-1]]

        for (let j = 0; j < triangle.length; j++) {
            newPoints.push(triangle[j].x)
            newPoints.push(triangle[j].y)
        }
    }
    return newPoints
}

const shapesJoin = () => { // return array join of array of shapes
    const shapes_join = shapes.points.map(el => generateCoordinatesForShader(el.curPoints)).join().split(",").map(el => parseFloat(el))
    return shapes_join
}

const mapValue = (value, min1, max1, min2, max2) => {

    return (value*(max2-min2) - max2*min1 + min2*max1)/(max1-min1)
}

document.onclick = (e) => {
    const Canvas = document.querySelector('canvas').getBoundingClientRect()
    const Body = document.querySelector('body').getBoundingClientRect()

    // only cintinue if mouse click performed in the canvas
    if (!(e.clientX >= Canvas.left &&
        e.clientX <= Canvas.right &&
        e.clientY >= Canvas.top &&
        e.clientY <= Canvas.bottom)) {

        // if click in a plane
        return
    }

    console.log(e.clientX, e.clientY)
    console.log(mapValue(e.clientX, Canvas.left, Canvas.right, 0, 1), mapValue(e.clientY, Canvas.bottom, Canvas.top, 0, 1))
}

var shapes_join = shapesJoin();


// webgl context
var gl = canvas.getContext('webgl');

function drawFromArray(shapeArray, valNumber1, valNumber2) {
    // Create an empty buffer object
    var vertex_buffer = gl.createBuffer();

    // Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shapeArray), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    /*=================== Shaders ====================*/

    // Vertex shader source code
    var vertCode =
    'attribute vec2 coordinates;' +
    'void main(void) {' +
        ' gl_Position = vec4(coordinates, 0.0, 1.0);' +
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
    gl.vertexAttribPointer(coord, valNumber1, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);

    /*============ Drawing the triangle =============*/

    // Clear the canvas
    gl.clearColor(1, 1, 1, 1);

    // Enable the depth test
    gl.enable(gl.DEPTH_TEST);

    // Clear the color and depth buffer
    // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Set the view port
    gl.viewport(0,0,canvas.width,canvas.height);

    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, valNumber2);
}

function drawSquare(shape) {
    var x = shape.center[0];
    var y = shape.center[1];
    var s = shape.size/2;
    var vertex1 = [x-s, y+s, 0];
    var vertex2 = [x+s, y+s, 0];
    var vertex3 = [x+s, y-s, 0];
    var vertex4 = [x-s, y-s, 0];
    var triple1 = vertex1.concat(vertex2, vertex3);
    var triple2 = vertex1.concat(vertex3, vertex4);
    drawFromArray(triple1, 3, 6);
    drawFromArray(triple2, 3, 6);
}

function drawShape(shape) {
    if (shape.type == 'triangle') {
        drawFromArray(shape.vertices, 3, 6);
    } else if (shape.type == 'square') {
        drawSquare(shape);
    } else {
        drawFromArray(shape, 2, 100);
    }
}

function drawAll() {
    for (var i = 0; i < shapeItems.length; i++) {
        drawShape(shapeItems[i]);
    }
}

function clearBoard() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function replaceShape(index, newShapeArray) {
    shapeItems[index] = newShapeArray;
    clearBoard();
    drawAll();
}

function changeSquareSize(index, size) {
    newSquare = shapeItems[index];
    newSquare.size = size;
    replaceShape(index, newSquare);
}

var triangle1 = {
    type: 'triangle',
    vertices: [
        -0.9,-0.4,0,
        -0.7,-0.4,0,
        -0.6,0.5,0
    ]
}

var square1 = {
    type: 'square',
    center: [-0.3,0.0],
    size: 0.4
}

shapeItems.push(shapes_join);
shapeItems.push(triangle1);
shapeItems.push(square1);

drawAll();

changeSquareSize(2, 0.6);
