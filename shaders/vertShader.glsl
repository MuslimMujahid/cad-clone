attribute vec2 a_pos;
uniform vec2 u_resolution;
uniform mat3 u_proj_mat;

void main() {
    vec2 position = (u_proj_mat * vec3(a_pos, 1)).xy;
    vec2 zeroToOne = position / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace, 0, 1);
}