"use strict";

window.addEventListener("DOMContentLoaded", initPage);

const link = "https://petlatkea.dk/2021/hogwarts/students.json";
const bloodstatuslink = "https://petlatkea.dk/2021/hogwarts/families.json";
let json;


//Array
let allStudArray = [];

//Expelled student list
let explldStudArray = []; 
let selectedStudent;
let bloodstatus;

let studentTemplate = {
  firstname: "-not set yet-",
  lastname: "-not set yet-",
  middlename: "-not set yet-",
  nickname: "-not set yet-",
  photo: "-not set yet-",
  house: "-not set yet-",
  bloodstatus: "",
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
let numberOfStudents = document.querySelector(".studentnumber");

function initPage() {
  console.log("ready");

  readBtns();

  fetchStudentData();
    
}

async function fetchStudentData() {
  const respons = await fetch(link);
  json = await respons.json();

  const respons1 = await fetch(bloodstatuslink);
  bloodstatus = await respons1.json();
  prepareObjects(json);
}

async function fetchBloodstatusData() {
  const respons = await fetch(bloodstatuslink);
  bloodstatus = await respons.json();
}

//Search 
function startSearch(event) {
  let searchList = allStudArray.filter((student) => {
    let name = "";
    if (student.lastname === null) {
      name = student.firstname;
    } else {
      name = student.firstname + " " + student.lastname;
    }
    return name.toLowerCase().includes(event.target.value);
  });

  //Show number of students
  numberOfStudents.textContent = `Students: ${searchList.length}`;
  showStudentList(searchList);
}

//------------------FILTER FUNCTIONS START------------------------//
function readBtns() {
  //adds an eventlistener to each filterbutton
  document
    .querySelectorAll("[data-action='filter']")
    .forEach((button) => button.addEventListener("click", selectedFilter));

  //looks after changes in the options under #sortingList
  document.querySelector("#sortingList").onchange = function () {
    selectedSort(this.value);
  };
}

function selectedFilter(event) {
  //reads witch button is clicked
  const filter = event.target.dataset.filter;
  console.log(`Use this ${filter}`);
  //filterList(filter);
  setFilter(filter);
}

function setFilter(filter) {
  filterType = filter;
  buildList();
}

function filterList(filterredList) {
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

//sorts by firstname a-z
function sortByFirstnameAZ(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by firstname z-a
function sortByFirstnameZA(firstnameA, firstnameB) {
  if (firstnameA.firstname < firstnameB.firstname) {
    return 1;
  } else {
    return -1;
  }
}

//sorts by lastname a-z
function sortByLastnameAZ(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
    return -1;
  } else {
    return 1;
  }
}

//sorts by lastname z-a
function sortByLastnameZA(lastnameA, lastnameB) {
  if (lastnameA.lastname < lastnameB.lastname) {
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
  let currentList = filterList(allStudArray);
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

    const firstSpaceBeforeName = fullName.indexOf(" ");
    const lastSpaceBeforeName = fullName.lastIndexOf(" ");

    const firstQuotationMark = fullName.indexOf('"');
    const lastQuotationMark = fullName.indexOf('"');

    let lastName = "";
    let indexhyphen = 0;
    let firstLetterAfterHyphen = "";
    let smallLettersAfterHyphen = "";

    //Create the new object from the empty object template
    const student = Object.create(studentTemplate);

    //Insert value/string/substring into place
    //Firstname inserts in index 0
    let firstName =
      splitFullName[0].substring(0, 1).toUpperCase() +
      splitFullName[0].substring(1);

    student.firstname = firstName;

    if (splitFullName.length > 1) {
      //Lastname inserts in at lastIndexOf
      lastName =
        splitFullName[splitFullName.length - 1].substring(0, 1).toUpperCase() +
        splitFullName[splitFullName.length - 1].substring(1);

      //Check for a hyphen in the lastnames
      indexhyphen = lastName.indexOf("-");
      if (indexhyphen != -1) {
        const nameBeforeHyphen = lastName.substring(0, indexhyphen + 1);
        firstLetterAfterHyphen = lastName
          .substring(indexhyphen + 1, indexhyphen + 2)
          .toUpperCase();
        smallLettersAfterHyphen = lastName.substring(indexhyphen + 2);
        lastName =
          nameBeforeHyphen + firstLetterAfterHyphen + smallLettersAfterHyphen;
      }

      student.lastname = lastName;

      //Middlename inserts in index 2
      let middlename = "";
      let nickname = null;
      if (splitFullName.length > 2) {
        if (splitFullName[1].indexOf('"') >= 0) {
          nickname = splitFullName[1].replaceAll('"', "");

          nickname =
            nickname.substring(0, 1).toUpperCase() + nickname.substring(1);
          middlename = null;
        } else {
          middlename =
            splitFullName[1].substring(0, 1).toUpperCase() +
            splitFullName[1].substring(1);
          nickname = null;
        }
      } else {
        middlename = null;
      }

      student.middlename = middlename;
      student.nickname = nickname;

      //console.log(middlename);
      //console.log(nickname);
    } else {
      student.lastname = null;
      student.middlename = null;
      student.nickname = null;
    }

    //Photo
    if (student.lastname != null) {
      if (indexhyphen == -1) {
        if (student.firstname == "Padma" || student.firstname == "Parvati") {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0).toLowerCase() +
            ".png";
        } else {
          student.photo =
            lastName.toLowerCase() +
            "_" +
            firstName.substring(0, 1).toLowerCase() +
            ".png";
        }
      } else {
        student.photo =
          firstLetterAfterHyphen.toLocaleLowerCase() +
          smallLettersAfterHyphen +
          "_" +
          firstName.substring(0, 1).toLowerCase() +
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
     student.bloodstatus = matchBloodstatusWithStudentName(student);



    //Adds all objects (students) into the array
    allStudArray.push(student);
  });
  showStudentList(allStudArray);
}


function matchBloodstatusWithStudentName(student) {
  if (bloodstatus.half.indexOf(student.lastname) != -1) {
    return "Half-blood";
  } else if (bloodstatus.pure.indexOf(student.lastname) != -1) {
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
    if (student.lastname == null) {
      klon.querySelector(".fullname").textContent = student.firstname;
    } else {
      klon.querySelector(".fullname").textContent =
        student.firstname + " " + student.lastname;
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

  //make it visible that the expelledbutton is clicked//
  if (student.expelled != true) {
    document.querySelector("#expellbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#expellbtn").classList.add("clickedbutton");
  }
//make it visible that the prefectbutton is clicked//
  if (student.prefect != true) {
    document.querySelector("#prefectbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#prefectbtn").classList.add("clickedbutton");
  }
//make it visible that the squadbutton is clicked//
  if (student.squad != true) {
    document.querySelector("#isbtn").classList.remove("clickedbutton");
  } else {
    document.querySelector("#isbtn").classList.add("clickedbutton");
  }

//show text from HTML, if the student is viewed again//
  if (student.expelled === true) {document.querySelector("#expelled_text").classList.remove("hide");} 
  if (student.prefect === true) {document.querySelector("#prefect_text").classList.remove("hide");} 
  if (student.squad === true) {document.querySelector("#squad_text").classList.remove("hide");} 
  







  if (student.middlename == null && student.nickname == null) {
    if (student.lastname == null) {
      popup.querySelector("h2").textContent = student.firstname;
    } else {
      popup.querySelector("h2").textContent =
        student.firstname + " " + student.lastname;
    }
  } else if (student.middlename != null) {
    popup.querySelector("h2").textContent =
      student.firstname + " " + student.middlename + " " + student.lastname;
  } else if (student.nickname != null) {
    popup.querySelector("h2").textContent =
      student.firstname +
      " " +
      '"' +
      student.nickname +
      '"' +
      " " +
      student.lastname;
  }
  popup.querySelector(".blodstatus").textContent = student.bloodstatus;
  popup.querySelector(".house").textContent = student.house;
  popup.querySelector("#house_crest").src =
    "housecrests/" + student.house + ".svg";
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

  selectedStudent = student;
}


  function expell() {
    if (selectedStudent.lastname != "Nielsen") {
      //removes expelled student form allStudArray list
      if (selectedStudent.expelled === false) {
        allStudArray.splice(allStudArray.indexOf(selectedStudent), 1);
        selectedStudent.expelled = true;
        selectedStudent.prefect = false;
        explldStudArray.push(selectedStudent);
        document.querySelector("#expellbtn").classList.add("clickedbutton");
        document.querySelector("#prefectbtn").classList.remove("clickedbutton");
        console.log("expell");
      } else {
        alert("This student is allready expelled!");
        console.log("This student is allready expelled");
      }
    } else {
      alert(
        `Sorry bro! Can't expell ${selectedStudent.firstname} "${selectedStudent.nickname}" ${selectedStudent.lastname}! 😝`
      );
    }
  
    buildList();
  }


function togglePrefect() {
  console.log("toggle prefect");
  if (selectedStudent.expelled === false) {
    const index = allStudArray.indexOf(selectedStudent);
    if (selectedStudent.prefect === false) {
      housePrefectCheck();
    } else {
      removePrefect(selectedStudent);
    }
  } else {
    alert("This student is expelled! An expelled students can't be a Prefect!");
  }

  function housePrefectCheck() {
    console.log("chekking for house prefects");
    const houseprefects = [];
    allStudArray.filter((student) => {
      if (student.house === selectedStudent.house && student.prefect === true) {
        
        houseprefects.push(student);
      }
    });
    console.log("prefect house: " + houseprefects.length);
    const numberOfPrefects = houseprefects.length;
    const other = [];
    houseprefects.filter((student) => {
      if (student.gender === selectedStudent.gender) {
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
      makePrefect(selectedStudent);
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
    document.querySelector("#onlytwoprefects .prefect1").textContent = other.firstname;

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
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
}


function toggleSquad() {
  console.log("toggle squad");
  const index = allStudArray.indexOf(selectedStudent);
  if (selectedStudent.expelled === false) {
    if (selectedStudent.squad === false) {
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
      selectedStudent.bloodstatus === "Pure-blood" &&
      selectedStudent.house === "Slytherin"
    ) {
      makeSquad();
    } else {
      alert(
        "Only pure-blooded students from Slytherin can join the Inquisitorial Squad! 🐍"
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

