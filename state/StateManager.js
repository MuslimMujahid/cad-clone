class StateManager {
    constructor() {
        this.state = stateType.SELECT;
        this.hoverObjectId = null;
        this.selectedObjectId = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.color = null;
    } 

    setState(state) {
        this.state = state;
    }

    hover(objectId) {
        this.hoverObjectId = objectId;
    }

    select(objectId) {
        if (objectId > 0) {
            this.selectedObjectId = this.hoverObjectId;
            console.log(`select object ${objectId}`)
        }
    }
}