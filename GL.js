class GLObject {
    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
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

    bind() {
        const gl = this.gl;
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
    }

    draw() {
        const gl = this.gl;
        gl.useProgram(this.shader);
        
        let cord = gl.getAttribLocation(this.shader, "a_pos");
        gl.vertexAttribPointer(cord, 2, gl.FLOAT, false, 0, 0);
        
        const projectionMat = mul(mul(rotationMat(this.rotation), scaleMat(this.scaleX, this.scaleY)), translateMat(this.translateX, this.translateY));
        const uniformPos = gl.getUniformLocation(this.shader, 'u_proj_mat')
        gl.uniformMatrix3fv(uniformPos, false, projectionMat);
        gl.enableVertexAttribArray(cord);
        console.log(scaleMat(this.scaleX, this.scaleY));

        //find location from fragment shader and add color
        var fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        gl.uniform4f(fColorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}
