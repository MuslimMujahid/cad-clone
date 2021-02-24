class Shader {
    constructor(gl) {
        this.gl = gl;
    }

    program(vertShader, fragShader) {
        const gl = this.gl;
        const program = this.gl.createProgram();
        gl.attachShader(program, vertShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        return program;
    }
}