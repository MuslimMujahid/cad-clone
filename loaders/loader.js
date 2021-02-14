async function loadShader(path, shaderType, gl) {
    const read = await fetch(path).then(res => res.text());
    const shader = gl.createShader(shaderType);
    gl.shaderSource(shader, read);
    gl.compileShader(shader);

    return shader;
}