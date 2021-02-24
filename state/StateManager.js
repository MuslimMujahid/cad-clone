class StateManager {
    constructor() {
        this.state = stateType.SELECT;
        this.selectedObject = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.prevMouseX = 0;
        this.prevMouseY = 0;
        this.color = null;
    } 

    setState(state) {
        this.state = state;
    }

    select(objectId) {
        if (this.selectedObjectId != objectId) {
            this.selectedObjectId = objectId;
        } else {
            this.selectedObjectId = null;
        }
    }
}