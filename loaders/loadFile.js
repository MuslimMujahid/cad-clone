const loadFile = async (filename) => {
  // fetch from file to get raw file data
  return await fetchFile(filename);
};

async function fetchFile(filename) {
  // fetch the source file to get json data
  return await fetch(filename).then((res) => res.text());
}

async function initModelFile(gl, shaderProgram, selectShaderProgram, filename, renderer) {
  // ID GLOBJECT HARUS >= 1
  const modelJson = await loadFile(filename);
  let GlDataList = JSON.parse(modelJson);
  renderer.clearObjList();
  for (let i = 0; i < GlDataList.length; i++) {
    let glObject = new GLObject(i + 1, shaderProgram, selectShaderProgram, gl);
    glObject.setVertexArray(GlDataList[i].vertexArray);
    glObject.setColor(
      GlDataList[i].color[0],
      GlDataList[i].color[1],
      GlDataList[i].color[2],
      GlDataList[i].color[3]
    );
    glObject.translate(GlDataList[i].translateX, GlDataList[i].translateY);
    glObject.rotate(GlDataList[i].rotation);
    glObject.scale(GlDataList[i].scaleX, GlDataList[i].scaleY);

    renderer.addObject(glObject);
    // console.log("Object added");
    // console.log(renderer);
  }
}
