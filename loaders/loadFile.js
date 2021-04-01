function saveData() {
  var json = JSON.stringify(renderer, null, 4);
  let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(json);
  let exportFileDefaultName = "model.json";

  let linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function loadData() {
  let linkElement = document.createElement("input");
  linkElement.setAttribute("type", "file");
  linkElement.setAttribute("name", "file-load");
  linkElement.setAttribute("value", "file-load");
  linkElement.setAttribute("id", "file-load");
  linkElement.setAttribute("onchange", "importData()");

  var dynamicParent = document.getElementById("dynamic-parent");
  dynamicParent.appendChild(linkElement);

  linkElement.click();
}

async function importData() {
  var fileUpload = document.getElementById("file-load");

  if (fileUpload.value !== "") {
    var path = (window.URL || window.webkitURL).createObjectURL(fileUpload.files[0]);
    await initModelFile(path);
  }
}

async function initModelFile(filename) {
  const modelJson = await loadFile(filename);
  renderer = JSON.parse(modelJson);

  // TODO: reset and redraw
  renderer.render();
}

const loadFile = async (filename) => {
  return await fetchFile(filename);
};

async function fetchFile(filename) {
  return await fetch(filename).then((res) => res.text());
}