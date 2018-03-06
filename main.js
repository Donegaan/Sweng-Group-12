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
var csvPlacement = fs.readFileSync(path.join(__dirname, 'Placements.csv'),{ encoding : 'utf8'});
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
var studentJson = csvjson.toObject(csvData,csvOptions);
var placementJson = csvjson.toObject(csvPlacement, csvOptions);

//Testing the add, edit and remove functions
studentJson = addStudent(studentJson, "00000", "Test Name", "D1", "000");
studentJson = editStudent(studentJson, "00000", "John Doe", "D3","111");
//studentJson = removeStudent(studentJson,"00000")

placementJson = addPlacement(placementJson, "191","D1","1");
placementJson = editPlacement(placementJson,"191","D3","3");
//placementJson = removePlacement(placementJson,"191");

jsonfile.writeFile('studentJson.json',studentJson, function(err){
  if(err)
    console.error(err)});

console.log(studentJson);

jsonfile.writeFile('placementJson.json',placementJson, function(err){
  if(err)
  console.error(err)});

console.log(placementJson);

//Adds a new placement to the list
function addPlacement(placementJson, id, location, numPlacements){

  var newPlacementInfo = {"ID" : id,
                          "Location" : location,
                          "Number of Placements" : numPlacements};

  placementJson.push(newPlacementInfo);
  return placementJson;
}
//Searches for placement by ID and edits according to new parameters
function editPlacement(placementJson, id, location, numPlacements){

  for (var i=0; i<placementJson.length; i++){
    if(placementJson[i].ID ==id){
      placementJson[i].Location = location;
      placementJson[i]["Number of Placements"] = numPlacements;
    }
    else if(i==placementJson.length-1)
      console.log("Placement doesnt exist");
  }
  return placementJson;
}
//Removes a placement based on ID
function removePlacement(placementJson, id){

  for (var i=0; i<placementJson.length;i++){
    if(placementJson[i].ID == id){
      placementJson.splice(i,1);
    }
  }
  return placementJson;


}
/*
    Adds a new student to the JSON object
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
/*
  Removes a student from the list based on their student number.
*/
function removeStudent(jsonData, number){

  for (var i=0; i<jsonData.length;i++){
    if(jsonData[i].Number == number){
      jsonData.splice(i,1);
    }
  }
  return jsonData
}

// reading in data from students file
fs.readFile('students.csv', function (err, data){
  if(err) {
    return console.error(err);
  }
  //various array declarations
  var input = data + '';
  var fields = input.split(/[\n,]+/);
  var studentName = [];
  var studentNumber = [];
  var studentLocation = [];
  var studentPlacement = [];
 
  //separate into array with student number
  for( i=4; i<=fields.length;)
  {
    studentNumber.push(fields[i])
    i = i+4;
  }

  // separate into array with student names
  for( i=5; i<=fields.length;)
  {
    studentName.push(fields[i])
    i = i+4;
  }

    // separate into array with student location
    for( i=6; i<=fields.length;)
    {
      studentLocation.push(fields[i])
      i = i+4;
    }
    
    // separate into array with student current placement
    for( i=7; i<=fields.length;)
    {
      studentPlacement.push(fields[i])
      i = i+4;
    }
    //displayStudents(studentName, studentLocation, studentPlacement, studentNumber);
});

// reading in data from Previous Placements file
fs.readFile('Previous Placements.csv', function (err, data){
  if(err) {
    return console.error(err);
  }

  //various array declarations
  var input = data + '';
  var fields = input.split(/[\n,]+/);
  var studentNumber = [];
  var placementOne = [];
  var placementTwo = [];
  var placementThree = [];

  //separate into array with placem
  for( i=4; i<=fields.length;)
  {
    studentNumber.push(fields[i])
    i = i+4;
  }

  //separate into array with placementOne locations
  for( i=5; i<=fields.length;)
  {
    placementOne.push(fields[i])
    i = i+4;
  }

  // separate into array with placementTwo location
  for( i=6; i<=fields.length;)
  {
    placementTwo.push(fields[i])
    i = i+4;
  }

  // separate into array with placementThree location
  for( i=7; i<=fields.length;)
  {
    placementThree.push(fields[i])
    i = i+4;
  }
  //displayPastPlacement(studentNumber, placementOne, placementTwo, placementThree);
 });

// reading in data from Placements file
fs.readFile('Placements.csv', function (err, data){
  if(err) {
    return console.error(err);
  }
  
  //various array declarations
  var input = data + '';
  var fields = input.split(/[\n,]+/);
  var placementIds = [];
  var placementLocations = [];
  var numberOfPlacements = [];
  
  //separate into array with iDs
  for( i=3; i<=fields.length;)
  {
    placementIds.push(fields[i])
    i = i+3;
  }
  
  //separate into array with locations
  for( i=4; i<=fields.length;)
  {
    placementLocations.push(fields[i])
    i = i+3;
  }
  
  // separate into array with number of placements
  for( i=5; i<=fields.length;)
  {
    numberOfPlacements.push(fields[i])
    i = i+3;
  }

  //displayPlacementLocations(placementIds, placementLocations, numberOfPlacements);

  });

function displayStudents(studentName, studentLocation, studentPlacement, studentNumber)
{
 for(i =0; i<studentPlacement.length -1; i++)
 {
 console.log( "Name: " + studentName[i].toString() + ". " );
 console.log( "Location " + studentLocation[i].toString() + "." );
 console.log( "Current Placement " + studentPlacement[i].toString() + "\n" );
 console.log( "ID " + studentNumber[i].toString() + "\n" );
 }
}

function displayPlacementLocations(placementIds, placementLocations, numberOfPlacements)
{
  for(i =0; i<placementIds.length -1; i++)
  {
  console.log( "Number: " + placementIds[i].toString() + ". " );
  console.log( "Location: " + placementLocations[i].toString() + ". " );
  console.log( "Number of places: " + numberOfPlacements[i].toString() + "\n " )
  }
}

function displayPastPlacement(studentNumber, placementOne, placementTwo, placementThree)
{
  for(i=0; i<studentNumber.length -1; i++)
  {
   console.log( "ID: " + studentNumber[i].toString() + ". " );
   console.log( "PlacementOne: " + placementOne[i].toString() + ". " );
   console.log( "PlacementTwo: " + placementTwo[i].toString() + ". " );
   console.log( "PlacementThree: " + placementThree[i].toString() + "\n" );
  }
}