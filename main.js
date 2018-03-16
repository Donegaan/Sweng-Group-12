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
var jsonfile = require('jsonfile');
var jsonToCsv = require('convert-json-to-csv');


// Read in files
try{
  var csvData = fs.readFileSync(path.join(__dirname, 'Students.csv'), { encoding : 'utf8'}); // Read in csv file
}catch (err){
  if (err.code === 'ENOENT') {
    console.log('File not found!');
    console.log('Path of file in parent dir:', require('path').resolve(__dirname, 'Students.csv'));
  } else {
    throw err;
  }
}

try{
  var csvPlacement = fs.readFileSync(path.join(__dirname, 'Placements.csv'),{ encoding : 'utf8'});
}catch (err){
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  } else {
    throw err;
  }
}
try{
  var csvPrevPlace = fs.readFileSync(path.join(__dirname, 'Previous Placements.csv'),{ encoding : 'utf8'});
}catch (err){
  if (err.code === 'ENOENT') {
    console.log('File not found!');
  } else {
    throw err;
  }
}



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
  mainWindow.webContents.openDevTools()

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
var previousPlaceJson = csvjson.toObject(csvPrevPlace, csvOptions);


addPreviousPlacements();
//Testing the add, edit and remove functions
//studentJson = addStudent(studentJson, "00000", "Test Name","1", "D1", "000","Dublin");
//
//studentJson = removeStudent(studentJson,"00000")

//placementJson = addPlacement(placementJson, "191","D1","Dublin","1");
//placementJson = editPlacement(placementJson,"191","D3","Dublin","3");
//placementJson = removePlacement(placementJson,"191");

//jsonfile.writeFile('studentJson.json',studentJson, function(err){
//  if(err)
//    console.error(err)});

// console.log(studentJson);

//jsonfile.writeFile('placementJson.json',placementJson, function(err){
//  if(err)
//  console.error(err)});

// console.log(placementJson);

//json to csv
function writeToStudentCsv(){
  var columnHeaderArray=["Number","Name","Year", "Current Placement", "Location","County"];
  csvData = jsonToCsv.convertArrayOfObjects(studentJson, columnHeaderArray);
  csvData = csvData.replace(/"/g, '');
  fs.writeFile('Students.csv',csvData,'utf8', null);
}
function writeToPlacementCsv(){
  var columnHeaderArray=["ID","Number of Placements","Location","County"];
  csvPlacement = jsonToCsv.convertArrayOfObjects(placementJson, columnHeaderArray);
  csvPlacement = csvPlacement.replace(/"/g, '');
  fs.writeFile('Placements.csv',csvPlacement, 'utf8', null);
}
//Adds a new placement to the list
function addPlacement(placementJson, id, location, county, numPlacements){

  for(var i=0; i<placementJson.length; i++){
    if(placementJson[i].ID ==id){
      return placementJson;
    }

  }
  var newPlacementInfo = {"ID" : id,
                          "Location" : location,
                          "County" : county,
                          "Number of Placements" : numPlacements};

  placementJson.push(newPlacementInfo);
  return placementJson;
}
//Searches for placement by ID and edits according to new parameters
function editPlacement(){

  var placementId = document.getElementById("id").value;

  for (var i=0; i<placementJson.length; i++){
    if(placementJson[i].ID ==placmentId){
      placementJson[i].Location = document.getElementById("location").value;
      placementJson[i].County = doucument.getElementById("county").value;
      placementJson[i]["Number of Placements"] = document.getElementById("places").value;
      console.log("works");
    }
    else if(i==placementJson.length-1)
      console.log("Placement doesnt exist");
  }
  writeToPlacementCsv();
  jsonfile.writeFile('placementJson.json',placementJson, function(err){
  if(err) console.error(err)});
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
function addStudent(jsonData, number, name, year, location, currentPlacement,county){

  for(var i=0; i<jsonData.length; i++){
    //Returns the input if the student already exists
    if(jsonData[i].Number == number){
      return jsonData;
    }
  }
  var newStudentInfo = {"Number": number,
                        "Name": name,
                        "Year": year,
                        "Location": location,
                        "Current Placement": currentPlacement,
                        "County": county};

  jsonData.push(newStudentInfo);
  return jsonData;
}
/*
  Edits a students details based and searches based on student number
*/
function editStudent() {
  console.log("works");
  var studentNumber = document.getElementById("id").value;
  // console.log(studentNumber+" Works");
  for (var i=0; i<studentJson.length; i++){
    if(studentJson[i].Number == studentNumber){
      studentJson[i].Name = document.getElementById("name").value;
      studentJson[i].Year = document.getElementById("year").value;
      studentJson[i].Location = document.getElementById("location").value;
      studentJson[i]["Current Placement"] = document.getElementById("currPlace").value;
      studentJson[i].County = document.getElementById("county").value;
      console.log("works");
    }
    else if(i==jsonData.length-1)
      console.log("Student doesn't exist");
  }
  //Writing to the json and the csv
  writeToStudentCsv();
  jsonfile.writeFile('studentJson.json',studentJson, function(err){
    if(err) console.error(err)});
  // return jsonData;
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

//assignStudent(studentJson, placementJson);
function assignStudent(studentJson, placementJson)
{

// Assigning fourth years first which have a "Perfect match"
for(i=0; i<studentJson.length; i++)         //Looping through students
{
  for(j=0; j<placementJson.length ; j++)    //Looping through placements
  {
    if(studentJson[i]["Current Placement"] == "" && studentJson[i].Year == 4 && studentJson[i].Location == placementJson[j].Location && studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0)
    {
      studentAllocation(studentJson, placementJson);
    }
  }
}

//Finding Fourth Years with Correct County but not specific location
for(i=0; i<studentJson.length; i++)
{
  for(j=0; j<placementJson.length ; j++)
  {
    if(studentJson[i]["Current Placement"] == "" && studentJson[i].Year == 4 && studentJson[i].Location != placementJson[j].Location && studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0)
    {
      studentAllocation(studentJson, placementJson);
    }
  }
}

//Assigning remaining year groups with correct location
for( i=0; i<studentJson.length; i++)
{
  for( j=0; j<placementJson.length; j++)
  {
    if(studentJson[i]["Current Placement"] == "" && studentJson[i].Location == placementJson[j].Location && studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0)
    {
      studentAllocation(studentJson, placementJson);
    }
  }
}

//Remaining years, with correct Location
for( i=0; i<studentJson.length; i++)
{
  for( j=0; j<placementJson.length; j++)
  {
    if(studentJson[i]["Current Placement"] == "" && studentJson[i].Location != placementJson[j].Location && studentJson[i].County == placementJson[j].County && placementJson[j]["Number of Placements"] > 0)
    {
      studentAllocation(studentJson, placementJson);
    }
  }
}

//Left over students
for( i=0; i<studentJson.length; i++)
{
  for( j=0; j<placementJson.length; j++)
  {
  if(studentJson[i]["Current Placement"] == "" && studentJson[i].Location != placementJson[j].Location && studentJson[i].County != placementJson[j].County && placementJson[j]["Number of Placements"] > 0)
    {
      studentAllocation(studentJson, placementJson);
    }
  }
}
displayStudents(studentJson, placementJson);
}
function studentAllocation(studentJson, placementJson)
{
  studentJson[i]["Current Placement"] = placementJson[j].ID;      //Assign placement ID to student current placement
  placementJson[j]["Number of Placements"] = placementJson[j]["Number of Placements"] -1; //Decrement number of placements left at the location
}
function displayStudents(studentJson, placementJson)  //To check via console if placement is successful
{
 for(i =0; i<studentJson.length; i++)
 {

 console.log( "Number " + studentJson[i].Number.toString() + "." );
 console.log( "Name: " + studentJson[i].Name.toString() + ". " );
 console.log( "Location " + studentJson[i].Location.toString() + "." );
 console.log( "Current Placement " + studentJson[i]["Current Placement"].toString() + "." );
 console.log( "Student Year " + studentJson[i].Year.toString() + "." );
 console.log( "Student County " + studentJson[i].County.toString() + "\n" );

 }
}

function addPreviousPlacements(){

  for(i=0; i<previousPlaceJson.length;i++){
    for(j=0; j<studentJson.length;j++){
      if(previousPlaceJson[i]["Student Number"] == studentJson[j]["Number"])
      {
      //  console.log("Match found adding previous placements to object")
        // First Placement
        if(previousPlaceJson[i]["Placement 1 ID"] == "NA")
          studentJson[j]["Placement 1"] = "";
        else
          studentJson[j]["Placement 1"] = previousPlaceJson[i]["Placement 1 ID"];
        // Second Placement
        if(previousPlaceJson[i]["Placement 2 ID"] == "NA")
          studentJson[j]["Placement 2"] = "";
        else
          studentJson[j]["Placement 2"] = previousPlaceJson[i]["Placement 2 ID"];
        // Third Placements
        if(previousPlaceJson[i]["Placement 3 ID"] == "NA")
          studentJson[j]["Placement 3"] = "";
        else
          studentJson[j]["Placement 3"] = previousPlaceJson[i]["Placement 3 ID"];

      }
    }
  }
//  console.log(studentJson);
}
