class Renderer {

    constructor(gl, stateManager) {
        this.gl = gl;
        this.objList = [];
        this.objCount = 0;
        this.canvas = document.querySelector('canvas');
        this.stm = stateManager;
    }

    addObject(obj) {
        this.objList.push(obj);
        this.objCount++;
    }

    getMouse(e) {
        const Canvas = canvas.getBoundingClientRect();
        return {
            x: e.clientX-Canvas.left,
            y: window.innerHeight-e.clientY-(window.innerHeight-Canvas.bottom)
        }
    }

    render() {
        // clear buffer
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        // event handler
        this.canvas.onclick = function(e) {
            console.log(this.getMouse(e));
        }.bind(this);        

        // draw
        for (const obj of this.objList) {
            obj.draw();
        }
        requestAnimationFrame(this.render.bind(this));
    }

    renderTexture() {
        for (const obj of this.objList) {
            obj.drawSelect();
        }
    }
}