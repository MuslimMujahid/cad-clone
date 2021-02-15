class GLObject {
    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
        this.gl = gl;
    }

    setVertexArray(arr) {
        this.vertexArray = arr; 
    }
    
    setColor(r,g,b,a){
        this.color = [r,g,b,a]
    }

    translate(x, y) {}

    rotate(deg) {}

    scale(k) {}

    bind() {
        const gl = this.gl;
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertexArray), gl.STATIC_DRAW);
    }

    draw() {
        const gl= this.gl;
        gl.useProgram(this.shader);
        let cord = gl.getAttribLocation(this.shader, "coordinates");
        gl.vertexAttribPointer(cord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(cord); 
        
        //find location from fragment shader and add color
        var fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        gl.uniform4f(fColorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}