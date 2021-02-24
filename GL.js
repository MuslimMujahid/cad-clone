class GLObject {
    constructor(id, shader, selShader, gl) {
        this.id = id;
        this.shader = shader;
        this.selShader = selShader;
        this.gl = gl;

        this.translateX = 0;    
        this.translateY = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
    }

    setVertexArray(arr) {
        this.vertexArray = arr;
    }

    setColor(r,g,b,a) {
        this.color = [r,g,b,a]
    }

    translate(a, b) {
        this.translateX = a;
        this.translateY = b;
    }

    rotate(deg) {
        this.rotation = deg;
    }

    scale(kx, ky) {
        this.scaleX = kx;
        this.scaleY = ky;
    }

    draw() {
        const gl = this.gl;

        // create buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);

        // use program
        gl.useProgram(this.shader);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // get variables
        const a_pos = gl.getAttribLocation(this.shader, "a_pos");
        const uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.shader, 'u_resolution');
        const projectionMat = mul(mul(rotationMat(this.rotation), scaleMat(this.scaleX, this.scaleY)), translateMat(this.translateX, this.translateY));
        const fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        
        // set values
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_pos);
        gl.uniformMatrix3fv(uniformPos, false, projectionMat);
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);
        gl.uniform4f(fColorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);

        // draw object
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }

    drawSelect() {
        const gl = this.gl;
        gl.useProgram(this.selShader);

        // create buffer
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);

        // get variables
        const vertexPos = gl.getAttribLocation(this.selShader, "a_pos");
        const uniformCol = gl.getUniformLocation(this.selShader, "fColor");
        const uniformPos = gl.getUniformLocation(this.selShader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.shader, 'u_resolution');
        const projectionMat = mul(mul(rotationMat(this.rotation), scaleMat(this.scaleX, this.scaleY)), translateMat(this.translateX, this.translateY));

        // set values
        gl.uniformMatrix3fv(uniformPos, false, projectionMat);
        gl.vertexAttribPointer(vertexPos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPos);
        gl.uniform2f(u_resolution, gl.canvas.width, gl.canvas.height);

        // const uniformId = [
        //     ((this.id >> 0) & 0xFF) / 0xFF,
        //     ((this.id >> 8) & 0xFF) / 0xFF,
        //     ((this.id >> 16) & 0xFF) / 0xFF,
        //     ((this.id >> 24) & 0xFF) / 0xFF,
        // ]
        // gl.uniform4f(uniformCol, ...uniformId);
        gl.uniform4f(uniformCol, 55, 100, 0, 1);

        // draw
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}
