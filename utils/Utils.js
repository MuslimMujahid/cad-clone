function mapValue(value, min1, max1, min2, max2) {
    return (value*(max2-min2) - max2*min1 + min2*max1)/(max1-min1)
}

function polygonTriangularity(points) {
    let newPoints = []
    for (let i = 0; i < points.length-1; i += 2) {
        
        if (i+2 == points.length-i-2) continue;

        let triangle = [
            points[i], points[i+1], 
            points[i+2], points[i+3],
            points[points.length-i-2], points[points.length-i-1]
        ];
        triangle.forEach(point => {
            newPoints.push(point);
        });
    }
    return newPoints
}

function getColor(value) {
    var x = value.split("rgb")[1].split(", ")
    var r = parseInt(x[0].substr(1), 16),
        g = parseInt(x[1], 16),
        b = parseInt(x[2].slice(0,x[2].length-1), 16);
    return [r,g,b]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}