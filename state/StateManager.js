class StateManager {
    constructor() {
        this.state = stateType.SELECT;
        this.hoverObjectId = null;
        this.selectedObjectId = null;
        this.selectObjectToDragId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.color = null;

        // mouse event
        this.hold = false;
        this.mousedown = false;
        this.hold = false;

        // create shape event
        this.createRectangle = false;
        this.createTriangle = false;
        this.createLine = false;
    } 

    setState(state) {
        this.state = state;
    }

    hover(objectId) {
        this.hoverObjectId = objectId;
        if (objectId > 0) {
            document.querySelector('canvas').style.cursor = "grab";
        } else {
            document.querySelector('canvas').style.cursor = "default";
        }
    }

    select(objectId) {
        if (objectId > 0) {
            this.selectedObjectId = this.hoverObjectId;
            console.log(`select object ${objectId}`)
        }
    }
}