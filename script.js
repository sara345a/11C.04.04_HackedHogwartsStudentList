"use strict";

window.addEventListener("DOMContentLoaded", initPage);

const link = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodstatuslink = "https://petlatkea.dk/2021/hogwarts/families.json";
let json;


//Array
let allStudArray = [];

//Expelled student list
let explldStudArray = []; 
let chosenStudent;
let bloodStatus;

let studentTemplate = {
  firstName: "-not set yet-",
  lastName: "-not set yet-",
  middleName: "-not set yet-",
  nickName: "-not set yet-",
  photo: "-not set yet-",
  house: "-not set yet-",
  bloodStatus: "",
  expelled: false,
  member: "",
  prefect: false,
  squad: false,
 
};


//Global variables
let temp = document.querySelector("template");
let container = document.querySelector("section");
let filterType = "all";
let sortBy = "sorting";
const search = document.querySelector(".search");
search.addEventListener("input", startSearch);
let numberOfDisplayedStudents = document.querySelector(".studentnumber");
let systemIsHacked = false;

function initPage() {
  console.log("ready");

  //make the 4houses logo as the secretbutton
  document.querySelector("#hack").addEventListener("click", hackTheSystem);

  readBtns();

  fetchStudentData();
    
}

async function fetchStudentData() {
  const respons = await fetch(link);
  json = await respons.json();

  const responsBloodstatusLink = await fetch(bloodstatuslink);
  bloodStatus = await responsBloodstatusLink.json();
  prepareObjects(json);
}

async function fetchBloodstatusData() {
  const respons = await fetch(bloodstatuslink);
  bloodStatus = await respons.json();
}

//Search 
function startSearch(event) {
  let searchList = allStudArray.filter((student) => {
    let name = "";
    if (student.lastName === null) {
      name = student.firstName;
    } else {
      name = student.firstName + " " + student.lastName;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  numberOfDisplayedStudents.textContent = `Students: ${searchList.length}`;
  showStudentList(searchList);
}

//=====================FILTER FUNCTIONS START================================//
function readBtns() {
  //adds an eventlistener to each filterbutton
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", chosenFilter));

  //looks after changes in the options under #sortingList
  document.querySelector("#sortingList").onchange = function () {
    selectedSort(this.value);
  };
}

function chosenFilter(event) {
  //reads witch button is clicked
  const filter = event.target.dataset.filter;
  console.log(`Use this ${filter}`);
  //filteredList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  filterType = filter;
  buildList();
}

function filteredList(filterredList) {
  //adds the selected students to filteredList


  if (filterType === "gryffindor") {
    filterredList = allStudArray.filter(isGryffindor);
  } else if (filterType === "hufflepuff") {
    filterredList = allStudArray.filter(isHufflepuff);
  } else if (filterType === "ravenclaw") {
    filterredList = allStudArray.filter(isRavenclaw);
  } else if (filterType === "slytherin") {
    filterredList = allStudArray.filter(isSlytherin);
  } else if (filterType === "expelled") {
    filterredList = explldStudArray;
  }
  console.log(explldStudArray);


  console.log(filterredList);
  return filterredList;
}

function isGryffindor(house) {
  //rerutns true if a students house is Gryffindor
  return house.house === "Gryffindor";
}

function isHufflepuff(house) {
  //rerutns true if a students house is Hufflepuff
  return house.house === "Hufflepuff";
}

function isRavenclaw(house) {
  //rerutns true if a students house is Ravenclaw
  return house.house === "Ravenclaw";
}

function isSlytherin(house) {
  //rerutns true if a students house is Slytherin
  return house.house === "Slytherin";
}


function selectedSort(event) {
  //checks what option is clicked
  sortBy = event;
  console.log(`Use this ${sortBy}`);
  //sortList(sortBy);
  buildList();
}

function sortList(sortedList) {
  //based on what is clicked, calls the matching function
  //let sortedList = allStudArray;

  if (sortBy === "firstnamea-z") {
    sortedList = sortedList.sort(sortByFirstnameAZ);
  } else if (sortBy === "firstnamez-a") {
    sortedList = sortedList.sort(sortByFirstnameZA);
  } else if (sortBy === "lastnamea-z") {
    sortedList = sortedList.sort(sortByLastnameAZ);
  } else if (sortBy === "lastnamez-a") {
    sortedList = sortedList.sort(sortByLastnameZA);
  } else if (sortBy === "housea-z") {
    sortedList = sortedList.sort(sortByHouseAZ);
  } else if (sortBy === "housez-a") {
    sortedList = sortedList.sort(sortByHouseZA);
  }

  return sortedList;
}

//sorts by firstName a-z
function sortByFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by firstName z-a
function sortByFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstName < firstnameB.firstName) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by lastName a-z
function sortByLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by lastName z-a
function sortByLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastName < lastnameB.lastName) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by house a-z
function sortByHouseAZ(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by house z-a
function sortByHouseZA(houseA, houseB) {
  if (houseA.house < houseB.house) {
    return 1;
  } else {
    return -1;
  }
}


function buildList() {
  let currentList = filteredList(allStudArray);
  currentList = sortList(currentList);

  showStudentList(currentList);
}
//------------------FILTER FUNCTIONS END------------------------//


function prepareObjects(jsonData) {
  jsonData.forEach((jsonObject) => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array

    const fullname = jsonObject.fullname.trim();

    //Split "fullname" into smaller parts after each space. So we get name, type, description and age
    const fullName = jsonObject.fullname.toLowerCase().trim();
    const splitFullName = fullName.split(" ");

    let lastNameDisplay = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Create the new object from the empty object template
    const student = Object.create(studentTemplate);

    //Insert value/string/substring into place
    //Firstname inserts in index 0
    let firstNameDisplay =
      splitFullName[0].substring(0, 1).toUpperCase() +
      splitFullName[0].substring(1);

    student.firstName = firstNameDisplay;

    if (splitFullName.length > 1) {
      //Lastname inserts in at lastIndexOf
      lastNameDisplay =
        splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
        splitFullName[splitFullName.length - 1].substring(1);

      //Check for a hyphen in the lastnames
      indexhyphen = lastNameDisplay.indexOf("-");
      if (indexhyphen != -1) {
        const nameBeforeHyphen = lastNameDisplay.substring(0, indexhyphen + 1);
        firstLetterAfterHyphen = lastNameDisplay
          .substring(indexhyphen + 1, indexhyphen + 2)
          .toUpperCase();
        smallLettersAfterHyphen = lastNameDisplay.substring(indexhyphen + 2);
        lastNameDisplay =
          nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
      }

      student.lastName = lastNameDisplay;

      //Middlename inserts in index 2
      let middleName = "";
      let nickName = null;
      if (splitFullName.length > 2) {
        if (splitFullName[1].indexOf('"') >= 0) {
          nickName = splitFullName[1].replaceAll('"', "");

          nickName =
            nickName.substring(0, 1).toUpperCase() + nickName.substring(1);
          middleName = null;
        } else {
          middleName =
            splitFullName[1].substring(0, 1).toUpperCase() +
            splitFullName[1].substring(1);
          nickName = null;
        }
      } else {
        middleName = null;
      }

      student.middleName = middleName;
      student.nickName = nickName;

      //console.log(middleName);
      //console.log(nickName);
    } else {
      student.lastName = null;
      student.middleName = null;
      student.nickName = null;
    }

    //Photo
    if (student.lastName != null) {
      if (indexhyphen == -1) {
        if (student.firstName == "Padma" || student.firstName == "Parvati") {
          student.photo =
            lastNameDisplay.toLowerCase() +
            "_" +
            firstNameDisplay.substring(0).toLowerCase() +
            ".png";
        } else {
          student.photo =
            lastNameDisplay.toLowerCase() +
            "_" +
            firstNameDisplay.substring(0, 1).toLowerCase() +
            ".png";
        }
      } else {
        student.photo =
          firstLetterAfterHyphen.toLocaleLowerCase() +
          smallLettersAfterHyphen +
          "_" +
          firstNameDisplay.substring(0, 1).toLowerCase() +
          ".png";
      }
    } else {
      student.photo = null;
    }

    const house = jsonObject.house.toLowerCase().trim();
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

    //House is already a seperate string so just adds the age to the object
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

     //Gender 
     student.gender = jsonObject.gender; 
     student.prefect = false;

     //blood
     student.bloodStatus = matchBloodstatusWithStudentName(student);



    //Adds all objects (students) into the array
    allStudArray.push(student);
  });
  showStudentList(allStudArray);
}


function matchBloodstatusWithStudentName(student) {
  if (bloodStatus.half.indexOf(student.lastName) != -1) {
    return "Half-blood";
  } else if (bloodStatus.pure.indexOf(student.lastName) != -1) {
    return "Pure-blood";
  } else {
    return "Muggle-born";
  }
}


function showStudentList(students) {
  console.log(students);
  container.innerHTML = "";

    //showing the number of students showed on the list
  if (students.length === 1) {
    document.querySelector("#showedStudents").textContent =
      "Now showing " + students.length + " students";
  } else {
    document.querySelector("#showedStudents").textContent =
      "Now showing " + students.length + " students";
  }



  students.forEach((student) => {
    const klon = temp.cloneNode(true).content;
    if (student.lastName == null) {
      klon.querySelector(".fullname").textContent = student.firstName;
    } else {
      klon.querySelector(".fullname").textContent =
        student.firstName + " " + student.lastName;
    }
    if (student.photo != null) {
      klon.querySelector("img").src = "images/" + student.photo;
    }

    klon.querySelector(".house").textContent = student.house;
    klon.querySelector(".details").addEventListener("click", () => openSingleStudent(student));

    container.appendChild(klon);
  });


}


function openSingleStudent(student) {
  popup.style.display = "block";

  //make it visible that the expelledbutton, prefectbutton, squadbutton is clicked//
  if (student.expelled != true) {
    document.querySelector("#expellbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#expellbtn").classList.add("clickedbutton");
  }
//--""--
  if (student.prefect != true) {
    document.querySelector("#prefectbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#prefectbtn").classList.add("clickedbutton");
  }
//--""--
  if (student.squad != true) {
    document.querySelector("#isbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#isbtn").classList.add("clickedbutton");
  }

//show text from HTML, if the student is viewed again//
  if (student.expelled === true) {
    document.querySelector("#expelled_text").classList.remove("hide");
  }else {document.querySelector("#expelled_text").classList.add("hide"); } 
//--""--
  if (student.prefect === true) {
    document.querySelector("#prefect_text").classList.remove("hide");
  }else {document.querySelector("#prefect_text").classList.add("hide"); } 
//--""--
  if (student.squad === true) {
    document.querySelector("#squad_text").classList.remove("hide");
  }else {document.querySelector("#squad_text").classList.add("hide"); } 





  if (student.middleName == null && student.nickName == null) {
    if (student.lastName == null) {
      popup.querySelector("h2").textContent = student.firstName;
    } else {
      popup.querySelector("h2").textContent =
        student.firstName + " " + student.lastName;
    }
  } else if (student.middleName != null) {
    popup.querySelector("h2").textContent =
      student.firstName + " " + student.middleName + " " + student.lastName;
  } else if (student.nickName != null) {
    popup.querySelector("h2").textContent =
      student.firstName +
      " " +
      '"' +
      student.nickName +
      '"' +
      " " +
      student.lastName;
  }
  
  popup.querySelector(".house").textContent = student.house;
  popup.querySelector(".blodstatus").textContent = student.bloodStatus;
  document.querySelector("#house_crest").src = student.house + ".svg";
  if (student.photo != null) {
    popup.querySelector("#popup_student_pic").src = "images/" + student.photo;
  } else {
    popup.querySelector("#popup_student_pic").src = "";
  }

  //expell, prefect and squad
  document.querySelector("#expellbtn").addEventListener("click", expell);
  document.querySelector("#prefectbtn").addEventListener("click", togglePrefect);
  document.querySelector("#isbtn").addEventListener("click", toggleSquad);

  document.querySelector("#close").addEventListener("click", () => {
    popup.style.display = "none";
    document.querySelector("#expellbtn").removeEventListener("click", () => {});
    document
      .querySelector("#prefectbtn")
      .removeEventListener("click", () => {});
    document.querySelector("#isbtn").removeEventListener("click", () => {});
  });

  chosenStudent = student;
}


  function expell() {
    if (chosenStudent.lastName != "Nielsen") {
      //removes expelled student form allStudArray list
      if (chosenStudent.expelled === false) {
        allStudArray.splice(allStudArray.indexOf(chosenStudent), 1);
        chosenStudent.expelled = true;
        chosenStudent.prefect = false;
        chosenStudent.squad = false;
        explldStudArray.push(chosenStudent);
        document.querySelector("#expellbtn").classList.add("clickedbutton");
        document.querySelector("#prefectbtn").classList.remove("clickedbutton");
        document.querySelector("#isbtn").classList.remove("clickedbutton");
        console.log("expell");
      } else {
      alert("This student is allready expelled!");
      console.log("This student is allready expelled");
    }
  } else {
    let str = alert(
      `WOOPS! ${chosenStudent.firstName} "${chosenStudent.nickName}" ${chosenStudent.lastName} has hacked the system and can not be expelled!`);
  }

  buildList();
}


function togglePrefect() {
  console.log("toggle prefect");
  if (chosenStudent.expelled === false) {
    const index = allStudArray.indexOf(chosenStudent);
    if (chosenStudent.prefect === false) {
      housePrefectCheck();
    } else {
      removePrefect(chosenStudent);
    }
  } else {
    alert("This student is expelled! An expelled students can't be a Prefect!");
  }

  function housePrefectCheck() {
    console.log("chekking for house prefects");
    const houseprefects = [];
    allStudArray.filter((student) => {
      if (student.house === chosenStudent.house && student.prefect === true) {
        
        houseprefects.push(student);
      }
    });
    console.log("prefect house: " + houseprefects.length);
    const numberOfPrefects = houseprefects.length;
    const other = [];
    houseprefects.filter((student) => {
      if (student.gender === chosenStudent.gender) {
        other.push(student);
      }
    });
    console.log("other: " + other.length);
    //if there is another of the same type
    if (other.length >= 1) {
      removeOther(other[0]);
    } else if (numberOfPrefects >= 2) {
      console.log("There can only be two prefects of each house!");
      removePrefectAorB(houseprefects[0], houseprefects[1]);
    } else {
      // allStudArray[index].prefect = true;
      console.log("add prefect");
      makePrefect(chosenStudent);
    }
  }

  function removePrefect(studentPrefect) {
    document.querySelector("#prefectbtn").classList.remove("clickedbutton");
    const index = allStudArray.indexOf(studentPrefect);
    allStudArray[index].prefect = false;
    popup.querySelector(".prefect").classList.add("hide");
  }

  function makePrefect(studentPrefect) {
    
    document.querySelector("#prefectbtn").classList.add("clickedbutton");
    const index = allStudArray.indexOf(studentPrefect);
    allStudArray[index].prefect = true;
  }

  function removeOther(other) {
    //ask the user to ignore ore remove the other
    document.querySelector("#onlytwoprefects").classList.remove("hide");
    document.querySelector("#onlytwoprefects .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#onlytwoprefects [data-action=remove1]").addEventListener("click", clickRemoveOther);

    //add name to button
    document.querySelector("#onlytwoprefects .prefect1").textContent = other.firstName;

    //if ignore - do nothing..
    function closeDialog() {
      document.querySelector("#onlytwoprefects").classList.add("hide");
      document
        .querySelector("#onlytwoprefects .closebutton")
        .removeEventListener("click", closeDialog);
      document
        .querySelector("#onlytwoprefects [data-action=remove1]")
        .removeEventListener("click", clickRemoveOther);
    }

    //if remove other:
    function clickRemoveOther() {
      removePrefect(other);
      makePrefect(chosenStudent);
      buildList();
      closeDialog();
    }
  }
}


function toggleSquad() {
  console.log("toggle squad");
  const index = allStudArray.indexOf(chosenStudent);
  if (chosenStudent.expelled === false) {
    if (chosenStudent.squad === false) {
      houseSquadCheck();
    } else {
      removeSquad();
    }
  } else {
    alert(
      "This student is expelled! An expelled students can't be a part of the Inquisitorial Squad!"
    );
  }

  function houseSquadCheck() {
    console.log("chekking for house squads");
    if (
      chosenStudent.bloodStatus === "Pure-blood" &&
      chosenStudent.house === "Slytherin"
    ) {
      makeSquad();
    } else {
      alert(
        "Looks like you aren't a pureblood Slytherin! You can't join!"
      );
    }
  }

  function makeSquad() {
    if (systemIsHacked === true) {
      setTimeout(function () {
        toggleSquad();
      }, 1000);
    }
    allStudArray[index].squad = true;
    // document.querySelector("#isbtn").classList.add("clickedbutton");
  }

  function removeSquad() {
    // document.querySelector("#isbtn").classList.remove("clickedbutton");
    if (systemIsHacked === true) {
      setTimeout(function () {
        alert("Wuups.. Can't do that.. HA HA HA!");
      }, 100);
      //alert("Wuups.. Can't do that.. HA HA HA!");
    }
    allStudArray[index].squad = false;
  }
}

function hackTheSystem() {
  if (systemIsHacked === false) {
    //add me to studentlist
    console.log("You have been hacked!");
    const thisIsMe = Object.create(studentTemplate);
    thisIsMe.firstName = "Sara";
    thisIsMe.lastName = "Nielsen";
    thisIsMe.middleName = null;
    thisIsMe.nickName = "The Hacker";
    thisIsMe.photo = "me.png";
    thisIsMe.house = "Hufflepuff";
    thisIsMe.gender = "girl";
    thisIsMe.prefect = false;
    thisIsMe.expelled = false;
    thisIsMe.bloodStatus = "Pure-blood";
    thisIsMe.squad = false;
    messWithBloodstatus();
    allStudArray.unshift(thisIsMe);

    //fuck up blood-status
    systemIsHacked = true;

    buildList();
    setTimeout(function () {
      alert("I hacked myself into the system and there isn't anything you can do about it!");
    }, 100);
  } else {
    alert("WARNING: You can't hack the system twice!");
  }
}

function messWithBloodstatus() {
  allStudArray.forEach((student) => {
    if (student.bloodStatus === "Muggle-born") {
      student.bloodStatus = "Pure-blood";
    } else if (student.bloodStatus === "Half-blood") {
      student.bloodStatus = "Pure-blood";
    } else {
      let bloodNumber = Math.floor(Math.random() * 3);
      if (bloodNumber === 0) {
        student.bloodStatus = "Muggle-born";
      } else if (bloodNumber === 1) {
        student.bloodStatus = "Half-blood";
      } else {
        student.bloodStatus = "Pure-blood";
      }
    }
  });
}