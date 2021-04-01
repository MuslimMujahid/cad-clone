class GLObject {

    static objCount = 0;

    constructor(shader, selShader, gl) {
        this.objCount += 1;
        this.id = [
            ((this.objCount >>  0) & 0xFF) / 0xFF,
            ((this.objCount >>  8) & 0xFF) / 0xFF,
            ((this.objCount >> 16) & 0xFF) / 0xFF,
            ((this.objCount >> 24) & 0xFF) / 0xFF,
        ]
        this.shader = shader;
        this.selShader = selShader;
        this.gl = gl;
        this.color = [0.2, 0.1, 0.5];

        // projection matrix
        this.matTranslation = Identity(3);
        this.negMatTranslation = Identity(3);
        this.matScale = Identity(3);
    }

    setVertexArray(arr) {
        this.vertexArray = polygonTriangularity(arr);
    }

    Origin(x, y) {
        const initialSize = 20;
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
        this.matTranslation = reshape([
            1, 0, 0,
            0, 1, 0,
            dx, dy, 1
        ], [3, 3])
    }

    Scale(dx, dy) {
        this.matScale = reshape([
            dx, 0, 0,
            0, dy, 0,
            0, 0, 1
        ], [3, 3])
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
        this.projMatrix = matmulMany(negOriginMat, this.matScale, originMat, this.matTranslation);
    }

    draw() {
        const gl = this.gl;

        // use program
        gl.useProgram(this.shader);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // get variables
        const a_pos = gl.getAttribLocation(this.shader, "a_pos");
        const uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.shader, 'u_resolution');
        // const projectionMat = mul(mul(rotationMat(this.rotation), scaleMat(this.scaleX, this.scaleY)), translateMat(this.translateX, this.translateY));
        this.calcProjectionMatrix();
        const projectionMat = flat(this.projMatrix)
        const fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        
        // set values
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_pos);
        gl.uniformMatrix3fv(uniformPos, false, flat(projectionMat));
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform3fv(fColorLocation, this.color);

        // draw object
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}

class Rectangle extends GLObject {

}
