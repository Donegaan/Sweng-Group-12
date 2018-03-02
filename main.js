/*--------------------------
        Boilerplate from: https://github.com/electron/electron-quick-start
 -------------------------*/


const electron = require('electron');
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');
var csvjson = require('csvjson'); // Package to convert csv to json for easier editing of data
var csvData = fs.readFileSync(path.join(__dirname, 'Students.csv'), { encoding : 'utf8'}); // Read in csv file
var jsonfile = require('jsonfile');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the main html page of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'pages/assign.html'),
    protocol: 'file:',
    slashes: true
  }))

//  Open the DevTools.
  //mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


//--------------------------------- Convert csv to JSON ------------------------------
var csvOptions = {
  delimiter : ',', // optional
  quote : '"' // optional
};

//var jsonData = csvjson.toColumnArray(csvData, csvOptions);
//console.log(jsonData);

//-------------------------Write to JSON ---------------------------------------
var jsonData = csvjson.toObject(csvData,csvOptions);

//Testing the add and edit functions
jsonData = addStudent(jsonData, "00000", "Test Name", "D1", "000");
jsonData = editStudent(jsonData, "00000", "John Doe", "D3","111");

jsonfile.writeFile('jsonData.json',jsonData, function(err){
  if(err)
    console.error(err)});

console.log(jsonData);
/*
    Adds a new student to the JSON object
    @param jsonData -the json object array that is being appended
    @param number -
    @param name -
    @param location -
    @param currentPlacement -
    @return -returns the appended object array
*/
function addStudent(jsonData, number, name, location, currentPlacement){

  var newStudentInfo = {"Number": number,
                        "Name": name,
                        "Location": location,
                        "Current Placement": currentPlacement};

  jsonData.push(newStudentInfo);
  return jsonData;
}
/*
  Edits a students details based and searches based on student number
  @param jsonData -the json object array that is being edited
  @param number - the number of the student who you want to edit
  @param name -
  @param location -
  @param currentPlacment -
  @return -returns the edited object array
*/
function editStudent(jsonData, number, name, location, currentPlacement) {

  for (var i=0; i<jsonData.length; i++){
    if(jsonData[i].Number == number){
      jsonData[i].Name = name;
      jsonData[i].Location = location;
      jsonData[i]["Current Placement"] = currentPlacement
    }
    else if(i==jsonData.length-1)
      console.log("Student doesn't exist");
  }

  return jsonData;
}
