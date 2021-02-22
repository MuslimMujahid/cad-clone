class GLObject {
    constructor(id, shader, gl) {
        this.id = id;
        this.shader = shader;
        this.gl = gl;
    }

    setVertexArray(arr) {
        this.vertexArray = arr;
    }

    setColor(r,g,b,a) {
        this.color = [r,g,b,a]
    }
    
    getCenterPoint() {
        let xMin = 1.0;
        let xMax = -1.0;
        let yMin = 1.0;
        let yMax = -1.0;

        for (let i = 0; i < this.vertexArray.length-1; i += 2) {
            let x = this.vertexArray[i];
            let y = this.vertexArray[i+1];
            if (x < xMin) xMin = x;
            if (x > xMax) xMax = x;
            if (y < yMin) yMin = y;
            if (y > yMax) yMax = y;
        }
        
        let xCenter = (xMin + xMax) / 2;
        let yCenter = (yMin + yMax) / 2;
        return [xCenter, yCenter];
    }

    translate(a, b) {
        let newPoints = [];
        for (let i = 0; i < this.vertexArray.length-1; i += 2) {
            let x = this.vertexArray[i];
            let y = this.vertexArray[i+1];
            newPoints.push(x + a);
            newPoints.push(y + b);
        }
        this.vertexArray = newPoints;
    }

    rotate(deg) {
        let rad = (Math.PI / 180) * deg;
        let sin = Math.sin(rad);
        let cos = Math.cos(rad);

        let newPoints = [];
        let center = this.getCenterPoint();
        let cx = center[0];
        let cy = center[1];

        for (let i = 0; i < this.vertexArray.length-1; i += 2) {
            let x = this.vertexArray[i];
            let y = this.vertexArray[i+1];
            newPoints.push((cos * (x - cx)) + (sin * (y - cy)) + cx);
            newPoints.push((cos * (y - cy)) - (sin * (x - cx)) + cy);
        }
        
        this.vertexArray = newPoints;
    }

    scale(k) {
        let newPoints = [];
        let center = this.getCenterPoint();
        let cx = center[0];
        let cy = center[1];
        for (let i = 0; i < this.vertexArray.length-1; i += 2) {
            let x = this.vertexArray[i];
            let y = this.vertexArray[i+1];
            newPoints.push(k * (x-cx) + cx);
            newPoints.push(k * (y-cy) + cy);
        }
        this.vertexArray = newPoints;
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
        let cord = gl.getAttribLocation(this.shader, "coordinates");
        gl.vertexAttribPointer(cord, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(cord);

        //find location from fragment shader and add color
        var fColorLocation = gl.getUniformLocation(this.shader, "fColor");
        gl.uniform4f(fColorLocation, this.color[0], this.color[1], this.color[2], this.color[3]);

        gl.drawArrays(gl.TRIANGLES, 0, this.vertexArray.length/2);
    }
}
