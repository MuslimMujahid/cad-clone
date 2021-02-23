/* 
    SELECT: default state, in this state user can select an object
    SELECTING: user selected an object in the canvas
    DRAWING: user selectad a shape in the tool and ready to draw
*/

const stateType = {
    SELECT: 'select',
    SELECTING: 'selecting',
    DRAWING: 'drawing'
}