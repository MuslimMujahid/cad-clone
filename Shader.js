class Shader {
    constructor(gl) {
        this.gl = gl;
        this.program = gl.createProgram();
    }

    attach(shader) {
        this.gl.attachShader(this.program, shader);
    }

    link() {
        this.gl.linkProgram(this.program);
    }
}