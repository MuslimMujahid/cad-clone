attribute vec2 a_pos; 
// uniform mat3 u_proj_mat;

void main(void) {
    // vec2 position = (u_proj_mat* vec3(a_position, 1)).xy;
    gl_Position = vec4(a_pos, 0.0, 1.0);
}