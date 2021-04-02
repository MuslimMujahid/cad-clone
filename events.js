
function eventsListen(renderer, sm, gl, shaders) {
    
    function setColor(color){
        if (sm.selectObjectById !== null) {
            const [x, y, z] = color;
            const object = renderer.selectObjectById(sm.selectedObjectId);
            object.setColor(mapValue(x, 0, 255, 0, 1),mapValue(y, 0, 255, 0, 1),mapValue(z, 0, 255, 0, 1));
        }
    }

    function getColor(value) {
        var x = value.split("rgb")[1].split(", ")
        var r = parseInt(x[0].substr(1)),
            g = parseInt(x[1]),
            b = parseInt(x[2].slice(0,x[2].length-1));
        return [r,g,b]
    }

    document.querySelector('canvas').onmousemove = function(e) {
        sm.prevMouseX = sm.mouseX;
        sm.prevMouseY = sm.mouseY;
        sm.mouseX = e.clientX * gl.canvas.width / canvas.clientWidth;  
        sm.mouseY = gl.canvas.height - e.clientY * gl.canvas.height / canvas.clientHeight - 1;  
        if (sm.mousedown) {
            if (sm.selectObjectToDragId !== null) {
                const moveX = sm.mouseX-sm.prevMouseX;
                const moveY = sm.mouseY-sm.prevMouseY;
                const object = renderer.selectObjectById(sm.selectObjectToDragId);
                console.log("move object");
                object.Translate(moveX, moveY);
            }
        }
    };

    document.querySelector('canvas').onmousedown = function(e) {
        if (sm.createRectangle) {
            const newObject = new GLRectangle(renderer.objCount+1, ...shaders, gl);
            newObject.Origin(sm.mouseX, sm.mouseY);
            renderer.addObject(newObject);
        } else if (sm.createTriangle) {
            const newObject = new GLTriangle(renderer.objCount+1, ...shaders, gl);
            newObject.Origin(sm.mouseX, sm.mouseY);
            renderer.addObject(newObject);
        } else {
            sm.select(sm.hoverObjectId)
            document.querySelector('canvas').style.cursor = "grabbing";
            sm.selectObjectToDragId = sm.hoverObjectId;
            sm.mousedown = true;
        }
    }

    document.onmouseup = function() {
        document.querySelector('canvas').style.cursor = "context-menu";
        
        if (sm.mousedown) {
            if (sm.selectObjectToDragId !== null) {
                sm.selectObjectToDragId = null;
            }
            sm.mousedown = false;
        }
    }

    document
        .querySelectorAll('.color')
        .forEach(elm => {
            elm.addEventListener('click', (e) => {
                setColor(getColor(e.target.style.backgroundColor))
            })
        })

    document.querySelector('#create-square').onclick = (e) => {
        if (sm.createRectangle) {
            document.querySelector('#create-square').style.backgroundColor = 'rgb(180, 180, 180)';
            sm.createRectangle = false;
        } else {
            document.querySelector('#create-square').style.backgroundColor = 'red';
            sm.createRectangle = true;
            sm.createTriangle = false;
            sm.createLine = false;
        }
    }
    document.querySelector('#create-triangle').onclick = (e) => {
        
        if (sm.createTriangle) {
            document.querySelector('#create-triangle').style.backgroundColor = 'rgb(180, 180, 180)';
            sm.createTriangle = false;
        } else {
            document.querySelector('#create-triangle').style.backgroundColor = 'red';
            sm.createTriangle = true;
            sm.createRectangle = false;
            sm.createLine = false;
        }
    }
}