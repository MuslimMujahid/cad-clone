
function eventsListen(renderer, sm) {
    
    function setColor(color){
        console.log("set color")
        if (sm.selectObjectById !== null) {
            console.log(`change color object ${sm.selectedObjectId} to ${color}`)
            const [x, y, z] = color;
            const object = renderer.selectObjectById(sm.selectedObjectId);
            console.log(object)
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
            if (sm.selectObjectById !== null) {
                const moveX = sm.mouseX-sm.prevMouseX;
                const moveY = sm.mouseY-sm.prevMouseY;
                const object = renderer.selectObjectById(sm.selectedObjectId);
                console.log("move object");
                object.Translate(moveX, moveY);
            }
        }
    };

    document.querySelector('canvas').onmousedown = function(e) {
        sm.prevMouseX = sm.mouseX;
        sm.prevMouseY = sm.mouseY;
        sm.mouseX = e.clientX * gl.canvas.width / canvas.clientWidth;  
        sm.mouseY = gl.canvas.height - e.clientY * gl.canvas.height / canvas.clientHeight - 1;  
        sm.select(sm.hoverObjectId)
    }

    document.onmousedown = function() {
        sm.mousedown = true;
    }

    document.onmouseup = function() {
        sm.mousedown = false;
    }

    document
        .querySelectorAll('.color')
        .forEach(elm => {
            elm.addEventListener('click', (e) => {
                setColor(getColor(e.target.style.backgroundColor))
            })
        })

    
}