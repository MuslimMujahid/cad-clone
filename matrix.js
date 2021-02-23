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