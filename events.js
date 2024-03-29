
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
        
        if ((sm.createLine || sm.createPolygon) && !sm.lineFirstPoint) {
            const line = renderer.objList[renderer.objCount-1];
            line.vertexArray = [...sm.curLineVertexArray, sm.mouseX, sm.mouseY];
        } else if (sm.mousedown) {
            if (sm.selectObjectToDragId !== null) {
                const moveX = sm.mouseX-sm.prevMouseX;
                const moveY = sm.mouseY-sm.prevMouseY;
                const object = renderer.selectObjectById(sm.selectObjectToDragId);
                object.Translate(moveX, moveY);
            }
        }
    };

    document.querySelector('canvas').ondblclick = function(e) {
        if (sm.createLine) {
            sm.createLine = false;
            sm.lineFirstPoint = true;
            document.querySelector('#create-line').style.backgroundColor = 'rgb(180, 180, 180)';
        } else if (sm.createPolygon) {

            // replace line object with polygon object
            const line = renderer.objList.pop();
            const polygon = new GLPolygon(renderer.objCount+1, ...shaders, gl);
            polygon.vertexArray = polygonTriangularity(line.vertexArray);
            
            // find center of polygon
            let maxX = -1;
            let minX = 999999;
            let maxY = -1;
            let minY = 999999;
            line.vertexArray.forEach((idx, elm) => {
                if (idx % 2 == 0) {
                    if (elm < minX) {
                        minX = elm
                    } else if (elm > maxX) {
                        maxX = elm;
                    }
                } else {
                    if (elm < minY) {
                        minY = elm
                    } else if (elm > maxY) {
                        maxY = elm;
                    }
                }
            })
            const origin = [minX+(maxX-minX)/2, minY+(maxY-minY)/2]
            polygon.Origin(...origin);
            renderer.objList.push(polygon);

            sm.createPolygon = false;
            sm.lineFirstPoint = true;
            document.querySelector('#create-polygon').style.backgroundColor = 'rgb(180, 180, 180)';
        } 
    }

    document.querySelector('canvas').onmousedown = function(e) {
        if (sm.createRectangle) {
            const newObject = new GLRectangle(renderer.objCount+1, ...shaders, gl);
            newObject.Origin(sm.mouseX, sm.mouseY);
            renderer.addObject(newObject);
        } else if (sm.createTriangle) {
            const newObject = new GLTriangle(renderer.objCount+1, ...shaders, gl);
            newObject.Origin(sm.mouseX, sm.mouseY);
            renderer.addObject(newObject);
        } else if (sm.createLine || sm.createPolygon) {
            if (sm.lineFirstPoint) {
                sm.lineFirstPoint = false;
                const line = new GLLine(renderer.objCount+1, ...shaders, gl);
                line.vertexArray = [sm.mouseX, sm.mouseY];
                sm.curLineVertexArray = line.vertexArray;
                renderer.addObject(line);
            } else {
                const line = renderer.objList[renderer.objCount-1];
                line.vertexArray = [...sm.curLineVertexArray, sm.mouseX, sm.mouseY];
                sm.curLineVertexArray = line.vertexArray;
            }
        } else {
            sm.select(sm.hoverObjectId)
            document.querySelector('canvas').style.cursor = "grabbing";
            sm.selectObjectToDragId = sm.hoverObjectId;
        }
        sm.mousedown = true;
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
            sm.createPolygon = false;
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
            sm.createPolygon = false;
        }
    }
    document.querySelector('#create-line').onclick = (e) => {
        console.log("create line");
        if (sm.createLine) {
            document.querySelector('#create-line').style.backgroundColor = 'rgb(180, 180, 180)';
            sm.createLine = false;
        } else {
            document.querySelector('#create-line').style.backgroundColor = 'red';
            sm.createLine = true;
            sm.createRectangle = false;
            sm.createTriangle = false;
            sm.createPolygon = false;
        }
    }
    document.querySelector('#create-polygon').onclick = (e) => {
        if (sm.createPolygon) {
            document.querySelector('#create-polygon').style.backgroundColor = 'rgb(180, 180, 180)';
            sm.createPolygon = false;
        } else {
            document.querySelector('#create-polygon').style.backgroundColor = 'red';
            sm.createPolygon = true;
            sm.createLine = false;
            sm.createRectangle = false;
            sm.createTriangle = false;
        }
    }

    // save and load
    document.querySelector('#save-button').onclick = () => {
        const name = document.getElementById('file-name').value;
        console.log(name);
        let objects = []
        renderer.objList.forEach(obj => {
            objInfo = {
                "vertexArray": obj.vertexArray,
                "color": obj.color,
                "origin": obj.origin,
                "translate": obj.translate,
                "scale": obj.scale,
                "type": obj.type
            }
            objects.push(objInfo)
        })
        const data = {"data": objects}
        const json = JSON.stringify(data);
        let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(json);

        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", `${name}.json`);
        linkElement.click();
    }

    document.querySelector('#load-button').onclick = async (e) => {
        e.preventDefault();
        const file = document.getElementById('import-file').files[0];
        const data = JSON.parse(await file.text()).data;

        renderer.objCount = 0;
        renderer.objList = [];

        data.forEach(item => {
            let newObject;
            if (item.type == "rectangle") {
                newObject = new GLRectangle(renderer.objCount+1, ...shaders, gl);
            } else if (item.type == "triangle") {
                newObject = new GLTriangle(renderer.objCount+1, ...shaders, gl);
            } else if (item.type == "line") {
                newObject = new GLLine(renderer.objCount+1, ...shaders, gl);
            } else if (item.type == "polygon") {
                newObject = new GLPolygon(renderer.objCount+1, ...shaders, gl);
            }

            if (item.origin)
                newObject.Origin(item.origin[0], item.origin[1]);
            
            newObject.vertexArray = item.vertexArray;
            newObject.color = item.color;
            newObject.translate = item.translate;
            newObject.type = item.type;
            renderer.addObject(newObject);
        })
    }
}