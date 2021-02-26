"use strict";

window.addEventListener("DOMContentLoaded", initPage);



//Array
let allStudArray = [];

//Expelled student list
let explldStudArray = []; 

let prefectsGryffindor = [];
let prefectsSlytherin = [];
let prefectsRavenclaw = [];
let prefectsHufflepuff = [];

let studentTemplate = {
  firstname: "-not set yet-",
  lastname: "-not set yet-",
  middlename: "-not set yet-",
  nickname: "-not set yet-",
  photo: "-not set yet-",
  house: "-not set yet-",
  gender: " ",
  expelled: false,
  member: "",
  prefect: false,
  blood: false,
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
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
  .then( response => response.json() )
  .then( jsonData => { 
      // when loaded, prepare objects
      prepareObjects(jsonData);
  });
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
  let filteredList = allStudArray;

  if (filterType === "gryffindor") {
    filterredList = allStudArray.filter(isGryffindor);
  } else if (filterType === "hufflepuff") {
    filterredList = allStudArray.filter(isHufflepuff);
  } else if (filterType === "ravenclaw") {
    filterredList = allStudArray.filter(isRavenclaw);
  } else if (filterType === "slytherin") {
    filterredList = allStudArray.filter(isSlytherin);
  } else if (filterType === "expelled") {
    filteredList = explldStudArray;
  }


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
    const house = jsonObject.house.toLowerCase().trim();

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

    //House is already a seperate string so just adds the age to the object
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1);

     //Gender 
     student.gender = jsonObject.gender; 


    //Adds all objects (students) into the array
    allStudArray.push(student);
  });
  showStudentList(allStudArray);
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
    klon.querySelector(".details").addEventListener("click", () => openSingleStudent(student));

    container.appendChild(klon);
  });
}

function openSingleStudent(student) {
  document.querySelector("#prefect_button").removeEventListener("click", prefectOff);
    document.querySelector("#prefect_button").removeEventListener("click", makePrefect);
    document.querySelector("#expell_button").removeEventListener("click", expell);


  popup.style.display = "block";
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
  //popup.querySelector(".blodstatus").textContent = student.house;
  popup.querySelector(".house").textContent = student.house;
  //popup.querySelector(".house_crest").src = ;
  if (student.photo != null) {
    popup.querySelector("img").src = "images/" + student.photo;
  }

  document
    .querySelector("#close")
    .addEventListener("click", () => (popup.style.display = "none"));

    //prefect

  if (student.prefect === true) {
    document.querySelector(".prefect").textContent = "Prefect of " + `${student.house}`;
    document.querySelector("#prefect_button").textContent = "Remove as prefect";
  } else {
    document.querySelector(".prefect").textContent = "";
    document.querySelector("#prefect_button").textContent = "Make a prefect";
  }
  if (student.prefect === false) {
    document.querySelector("#prefect_button").addEventListener("click", makePrefect);
  } else {
    document.querySelector("#prefect_button").addEventListener("click", prefectOff);
  }
  function makePrefect() {
    console.log(student.firstName + " is a Prefect");
    document.querySelector("#prefect_button").removeEventListener("click", makePrefect);
    checkingPrefectNumbers(student);
  }
  function prefectOff() {
    console.log(student.firstName + " is not a Prefect");
    document.querySelector("#prefect_button").removeEventListener("click", prefectOff);
    removePrefect(student);
  }
  //expell
  if (student.expelled === false) {
    popup.querySelector(".expelled").textContent = "";
    popup.querySelector("#expell_button").textContent = `Expell student`;
  } else if (student.expelled === true) {
    popup.querySelector(".expelled").textContent = "STUDENT IS EXPELLED";
    popup.querySelector("#expell_button").textContent = `Welcome back ${student.firstName}`;
  }

  function expell(student) {
    document.querySelector("#expell_button").removeEventListener("click", expell);
    expellStudent(student);
  }

  document.querySelector("#expell_button").addEventListener("click", expellStudentClosure);
  function expellStudentClosure() {
    document.querySelector("#expell_button").removeEventListener("click", expellStudentClosure);
    expellStudent(student);
    removePopUp();
  }

  //prefect
  document.querySelector("#prefect_button").addEventListener("click", addPrefectClosure);
  function addPrefectClosure() {
    document.querySelector("#prefect_button").removeEventListener("click", addPrefectClosure);
    addPrefect(student);
  }
  if (student.prefect === false) {
    popup.querySelector("#prefect_button").textContent = "Make student prefect";
    popup.querySelector("#prefecticon").classList.add("hidden");
  } else if (student.prefect === true) {
    popup.querySelector("#prefect_button").textContent = "Remove student prefect";
    popup.querySelector("#prefecticon").classList.remove("hidden");
  }

  popup.querySelector("#close").addEventListener("click", removePopUp);
}

function removePopUp() {
  document.querySelector("#popup").classList.add("hidden");
  document.querySelector("#popup").classList.remove("popupstyle");
  buildList();
}

////PREFECT////
function removePrefect(student) {
  console.log("remove prefect for " + student.firstName);
  student.prefect = false;
  openSingleStudent(student);
}
function addPrefect(student) {
  console.log("add prefect for " + student.firstName);
  student.prefect = true;
  openSingleStudent(student);
}

function checkingPrefectNumbers(student) {
  let prefectArray = [];

  if (student.house === "Gryffindor") {
    prefectArray = prefectsGryffindor;
  } else if (student.house === "Hufflepuff") {
    prefectArray = prefectsHufflepuff;
  } else if (student.house === "Ravenclaw") {
    prefectArray = prefectsRavenclaw;
  } else if (student.house === "Slytherin") {
    prefectArray = prefectsSlytherin;
  }

  // console.log(prefectArray);

  if (prefectArray.length < 2) {
    student.prefect = true;
    prefectArray.push(student);
    openSingleStudent(student);
    // console.log(student);
  } else if (prefectArray.length > 1) {
    document.querySelector("#prefectConflict .student").textContent = `${student.firstName} ${student.lastName}`;
  }
}

function expellStudent(student) {
  student.expelled = true;
  allStudArray.splice(allStudArray.indexOf(student), 1);
  explldStudArray.push(student);
  openSingleStudent(student);
  buildList();
}




