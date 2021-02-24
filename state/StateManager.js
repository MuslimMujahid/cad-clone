class StateManager {
    constructor() {
        this.state = stateType.SELECT;
        this.selectedObjectId = null;
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