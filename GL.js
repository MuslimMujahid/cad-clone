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

    bindTexture() {
        const gl = this.gl;
        const textureBuffer = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }

    bindDepthBuffer() {
        const gl = this.gl;
        const depthBuffer = gl.createRenderBuffer();
        gl.bindRenderBuffer(gl.RENDERBUFFER, depthBuffer);
        gl.bindTexture(gl.TEXTURE_2D, texBuf)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.canvas.width, gl.canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
        gl.bindRenderbuffer(gl.RENDERBUFFER, depBuf)
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.canvas.width, gl.canvas.height)
    }

    bindFrameBuffer() {
        const gl = this.gl;
        const frameBuffer = gl.createFrameBuffer();
        gl.bindFrameBuffer(gl.FRAMEBUFFER, frameBuffer);
        const attachment_point = gl.COLOR_ATTACHMENT0;
        const lvl = 0;
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

        const a_pos = gl.getAttribLocation(this.shader, "a_pos");
        const uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat');
        const u_resolution = gl.getUniformLocation(this.shader, 'u_resolution');
        const projectionMat = mul(mul(rotationMat(this.rotation), scaleMat(this.scaleX, this.scaleY)), translateMat(this.translateX, this.translateY));
        const fColorLocation = gl.getUniformLocation(this.shader, "fColor");

        gl.uniformMatrix3fv(uniformPos, false, projectionMat);
        gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_pos);
        const uniformId = [
            ((this.id >> 0) & 0xFF) / 0xFF,
            ((this.id >> 8) & 0xFF) / 0xFF,
            ((this.id >> 16) & 0xFF) / 0xFF,
            ((this.id >> 24) & 0xFF) / 0xFF,
        ]
        gl.uniform4f(fColorLocation, uniformId);
        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}
