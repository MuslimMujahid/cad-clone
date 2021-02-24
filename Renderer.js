class Renderer {

    constructor(gl, shader, selShader, stateManager) {
        this.gl = gl;
        this.objList = [];
        this.objCount = 11;
        this.canvas = document.querySelector('canvas');
        this.shader = shader;
        this.selShader = selShader;
        this.stm = stateManager;
    }

    addObject(obj) {
        this.objList.push(obj);
        this.objCount++;
    }

    renderTexture() {
        for (const obj of this.objList) {
            obj.drawSelect();
        }
    }

    render() {
        for (const obj of this.objList) {
            obj.draw();
        }
        requestAnimationFrame(this.render.bind(this));
    }
}