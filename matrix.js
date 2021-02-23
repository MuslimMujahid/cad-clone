function mul(mat1, mat2) {
    let result = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let val = 0;
            for (let k = 0; k < 3; k++) {
                val += (mat1[k + i*3] * mat2[k*3+ j]);
            }
            result.push(val);
        }
    }
    return result;
}

function translateMat(u, v) {
    return [
        1, 0, 0,
        0, 1, 0,
        u, v, 1
    ]
}

function rotationMat(deg) {
    const rad = deg * Math.PI/180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    
    return [
        cos, -sin, 0,
        sin, cos, 0,
        0, 0, 1
    ]
}

function scaleMat(kx, ky) {
    return [
        kx, 0, 0,
        0, ky, 0,
        0, 0, 1
    ]
}