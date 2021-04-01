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

function Identity(size) {
    let mat = []
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            row.push((i == j) ? 1 : 0);
        }
        mat.push(row);
    }
    return mat;
}

// return matrix multiplication of matA and matB
function matmul(matA, matB) {

    const sizeA = [matA.length, matA[0].length];
    const sizeB = [matB.length, matB[0].length];
    
    if (sizeA[1] !== sizeB[0]) {
        console.log(`Cant\'t multiply matrix with size ${sizeA} and ${sizeB}`);
        return;
    }

    let mat = new Array(sizeA[0]);
    for (let r = 0; r < sizeA[0]; r++) {
        mat[r] = new Array(sizeB[1]);
        for (let c = 0; c < sizeB[1]; c++) {
            mat[r][c] = 0;
            for (let i = 0; i < sizeB[0]; i++) {
                mat[r][c] += (matA[r][i] * matB[i][c]);
            }
        }
    }

    return mat;
}

function matmulMany(...mats) {
    let mat = mats[0];
    for (let i = 1; i < mats.length; i++) {
        mat = matmul(mat, mats[i]);
    }
    return mat;
}

// return matrix multiplication mat and scalar k
function mul(k, mat) {
    const size = (mat.length, mat[0].length);
    for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
            mat[i][j] *= k;
        }
    }
} 

// return flatten array of matrix mat
function flat(mat) {
    return mat.flat(2);
}

function reshape(arr, size) {

    if (size[0] * size[1] !== arr.length) {
        console.log("Invalid array length.");
        return;
    }

    let mat = [];
    for (let i = 0; i < size[0] * size[1]; i += size[1]) {
        mat.push(arr.slice(i, i + size[1]));
    }

    return mat;
}

// return transpose of matrix mat
function transpose(mat) {
    const size = (mat.length, mat[0].length);

    let tmat = [];
    for (let i = 0; i < size[0]; i++) {
        for (let j = 0; j < size[1]; j++) {
            tmat[j][i] = mat[i][j];
        }
    }

    return tmat;
}

function negation(mat) {
    const size = [mat.length, mat[0].length]
    let u = flat(mat);
    for (let i=0; i<u.length; i++) {
        u[i] = -u[i];
    }
    return reshape(u, [size[0], size[1]]);
}