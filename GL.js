class GLObject {

    constructor(id, shader, selShader, gl) {
        this.id = id;
        this.shader = shader;
        this.selShader = selShader;
        this.gl = gl;
        this.color = [0.2, 0.1, 0.5, 1];

        // projection values
        this.scale = [1, 1]
        this.translate = [0, 0]

        // projection matrix
        // this.matScale = Identity(3);
    }

    setVertexArray(arr) {
        this.vertexArray = polygonTriangularity(arr);
    }

    setColor(x, y, z) {
        this.color = [x, y, z, 1]
    }

    Origin(x, y) {
        const initialSize = 200;
        const shape = [
            x-initialSize/2, y+initialSize/2,
            x+initialSize/2, y+initialSize/2,
            x+initialSize/2, y-initialSize/2,
            x-initialSize/2, y-initialSize/2
        ]
        this.vertexArray = polygonTriangularity(shape);
        this.origin = [x, y]
    } 

    Translate(dx, dy) {
        this.translate[0] += dx;
        this.translate[1] += dy;
    }

    Scale(dx, dy) {
        this.scale[0] += dx;
        this.scale[1] += dy;
    }

    bind() {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
    }

    calcProjectionMatrix() {
        const [ox, oy] = this.origin; 
        const originMat = reshape([
            1, 0, 0,
            0, 1, 0,
            ox, oy, 1
        ], [3,3])
        const negOriginMat = reshape([
            1, 0, 0,
            0, 1, 0,
            -ox, -oy, 1
        ], [3,3])

        const [tx, ty] = this.translate;
        const matTranslation = reshape([
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1
        ], [3, 3])

        const [sx, sy] = this.scale;
        let matScale = reshape([
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1 
        ], [3, 3]);
        matScale = matmulMany(negOriginMat, matScale, originMat)
        this.projMatrix = matmulMany(matScale, matTranslation);
        console.log(this.projMatrix)
    }

    draw() {
        const gl = this.gl;

        // use program
        gl.useProgram(this.shader);
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // get variables
        const a_pos = gl.getAttribLocation(this.shader, "a_pos");
        const uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.shader, 'u_resolution');
        this.calcProjectionMatrix();
        const projectionMat = flat(this.projMatrix)
        const fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        
        // set values
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_pos);
        gl.uniformMatrix3fv(uniformPos, false, flat(projectionMat));
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform4fv(fColorLocation, this.color);

        // draw object
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }

    drawSelect() {
        const gl = this.gl;

        // use program
        gl.useProgram(this.selShader);
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // get variables
        const a_pos = gl.getAttribLocation(this.selShader, "a_pos");
        const uniformPos = gl.getUniformLocation(this.selShader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.selShader, 'u_resolution');
        this.calcProjectionMatrix();
        const projectionMat = flat(this.projMatrix)
        const fColorLocation = gl.getUniformLocation(this.selShader, "fColor");
        
        // set values
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_pos);
        gl.uniformMatrix3fv(uniformPos, false, flat(projectionMat));
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        const uniformId = [
            ((this.id >> 0) & 0xff) / 0xff,
            ((this.id >> 8) & 0xff) / 0xff,
            ((this.id >> 16) & 0xff) / 0xff,
            ((this.id >> 24) & 0xff) / 0xff,
        ];
        gl.uniform4fv(fColorLocation, uniformId);

        // draw object
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}

class GLRectangle extends GLObject {
    constructor(id, shader, selShader, gl) {
        super(id, shader, selShader, gl);
        this.type = "rectangle";
    }

    Origin(x, y) {
        const initialSize = 200;
        const shape = [
            x-initialSize/2, y+initialSize/2,
            x+initialSize/2, y+initialSize/2,
            x+initialSize/2, y-initialSize/2,
            x-initialSize/2, y-initialSize/2
        ]
        this.vertexArray = polygonTriangularity(shape);
        this.origin = [x, y]
    } 
}

class GLTriangle extends GLObject {
    constructor(id, shader, selShader, gl) {
        super(id, shader, selShader, gl);
        this.type = "triangle";
    }

    Origin(x, y) {
        const initialSize = 200;
        const shape = [
            x, y+initialSize/2,
            x+initialSize/2, y-initialSize/2,
            x-initialSize/2, y-initialSize/2
        ]
        this.vertexArray = polygonTriangularity(shape);
        this.origin = [x, y]
    }
}
