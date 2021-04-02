class Renderer {

    constructor(gl, shader, selShader, stateManager) {
        this.gl = gl;
        this.objList = [];
        this.objCount = 0;
        this.canvas = document.querySelector('canvas');
        this.shader = shader;
        this.selShader = selShader;
        this.stm = stateManager;
    }

    addObject(obj) {
        this.objList.push(obj);
        this.objCount++;
    }
    
    clearObjList() {
        this.objList = [];
        this.count = 0;
    }
    
    selectObjectById(id) {
        return this.objList.find(obj => obj.id === id);
    }

    renderTexture() {
        for (const obj of this.objList) {
            obj.drawSelect();
        }
    }

    render() {
        const gl = this.gl;
        for (const obj of this.objList) {
            obj.bind();
            obj.draw();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        // requestAnimationFrame(this.render.bind(this));
    }

    renderText() {
        const gl = this.gl;
        for (const obj of this.objList) {
            obj.bind();
            obj.drawSelect();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}