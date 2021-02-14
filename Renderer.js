class Renderer {

    constructor(gl) {
        this.gl = gl;
        this.objList = [];
        this.objCount = 0;
    }

    addObject(obj) {
        this.objList.push(obj);
        this.objCount++;
    }

    render() {
        console.log('render');
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        for (const obj of this.objList) {
            obj.draw();
        }
        requestAnimationFrame(this.render.bind(this));
    }
}