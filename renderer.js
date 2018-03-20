var {
    ipcRenderer
} = require('electron')
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//console.log("Test");

var button = document.getElementById("btn");
button.addEventListener('click', function () {
    ipcRenderer.send("getStudentData")
})

ipcRenderer.on('studentData', (event, studentJson) => {
    console.log(studentJson[0].Number)
    for (var i = 0; i < studentJson.length; i++) {
        var newTr = document.createElement("tr");
        var temp = [];
        for (var j = 0; j < studentJson[i].length; j++) {
            var new1 = document.createElement("td");
            new1.innerHTML = object.filed[j];
            console.log(new1);
            temp.append(new1);
        }
        newTr.innerHTML = temp
    }
})