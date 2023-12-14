let db = null;
let objectStore = null;
import { guid } from "./uid.js";
import {
  addProject,
  addChapter,
  saveChapter,
  accessProjects,
  createList,
  accessLists,
  addListItem,
<<<<<<< HEAD
=======
  displayLists,
>>>>>>> a739ac0 (update main with development.)
} from "./databaseFunctions.js";


//? This function helps with making transactions to the DB
//? for each objectStore we may want to add/create!
function makeTransaction(storeName, mode) {
  let transaction = db.transaction(storeName, mode);
  transaction.onerror = (err) => {
    console.warn(err);
  };
  return transaction;
}

const IDB = () => {
  //? Check if browser supports indexedDB.
  function indexedDBSupport() {
    return "indexedDB" in window;
  }
  if (!indexedDBSupport()) {
    throw new Error("Your browser does not support indexedDB!");
  }

  //? Make a request to open / create a database.
  const DBOpenReq = indexedDB.open("FableForger", 5);

  DBOpenReq.addEventListener("error", (err) => {
    console.warn(err);
  });

  DBOpenReq.addEventListener("success", (ev) => {
    // DB opened... after upgradeneeded.
    db = ev.target.result;
<<<<<<< HEAD
    console.log("Success", db);
=======
    getProjects();
>>>>>>> a739ac0 (update main with development.)
    // buildList();
  });

  DBOpenReq.addEventListener("upgradeneeded", (ev) => {
    // Inside the upgradeneeded is the only place
    // we can add, modify, and delete any data from the DB.
    db = ev.target.result;
<<<<<<< HEAD
    console.log("Upgrade", db);
    let oldVersion = ev.oldVersion;
    let newVersion = ev.newVersion || db.version;
    console.log(
      "DB updated from version",
      oldVersion,
      "to version",
      newVersion
    );

=======
>>>>>>> a739ac0 (update main with development.)
    if (!db.objectStoreNames.contains("projects")) {
      objectStore = db.createObjectStore("projects", {
        keyPath: "id",
      });
    }

    if (!db.objectStoreNames.contains("lists")) {
      // Add the missing lists object store
      const listsStore = db.createObjectStore("lists", {
        keyPath: "listId",
      });
    }
<<<<<<< HEAD

    // db.createObjectStore("", {
    //     keyPath: "id"
    // });
    // if(db.objectStoreNames.contains("")){
    //     db.deleteObjectStore("");
=======
    // Create "userProjects" object store if it doesn't exist
    if (!db.objectStoreNames.contains("userProjects")) {
      const userProjectsObjectStore = db.createObjectStore("userProjects", {
        keyPath: "relationshipId",
        autoIncrement: true,
      });

      // Add indexes to facilitate querying
      userProjectsObjectStore.createIndex("userId", "userId");
      userProjectsObjectStore.createIndex("projectId", "projectId");
    }

>>>>>>> a739ac0 (update main with development.)
  });

  const leftBtn = document.getElementById("left-panel-btn");
<<<<<<< HEAD
  // const noProjectBtn = document.getElementById("no-project-btn");

  leftBtn.addEventListener("click", (e) => {
=======
  const rightBtn = document.getElementById("add-custom-list-btn");
  const noProjectBtn = document.getElementById("no-project-btn");

  leftBtn.addEventListener("pointerdown", (e) => {
>>>>>>> a739ac0 (update main with development.)
    if (e.target.classList.contains("new-project")) {
      addProject(db, e);
    } else if (e.target.classList.contains("new-chapter")) {
      addChapter(db, e);
    }
  });

<<<<<<< HEAD
  const noProjectBtn = document.getElementById("no-project-btn");
  noProjectBtn.addEventListener("click", (e) => {
=======
  noProjectBtn.addEventListener("pointerdown", (e) => {
>>>>>>> a739ac0 (update main with development.)
    addProject(db, e);
  });

  const leftBackBtn = document.getElementById("left-panel-back");
  leftBackBtn.addEventListener("pointerdown", (e) => {
    if (leftBtn.classList.contains("new-project")) {
      return;
    }

    getProjects();
    leftBtn.classList.toggle("new-chapter", false);
    leftBtn.classList.toggle("new-project", true);
    const editor = document.querySelector(".writing-area");
    editor.classList.toggle("no-area", !editor.classList.contains("no-area"));
    editor.classList.toggle(
      "editor-area",
      !editor.classList.contains("editor-area"),
    );

    document.querySelector(".outline .subtitle").textContent = "Projects";
    const noProjectBtn = document.getElementById("no-project-btn");
    noProjectBtn.addEventListener("pointerdown", (e) => {
      addProject(db, e);
    });
    rightBtn.setAttribute("data-id", null);

    document.querySelector(".custom-lists").innerHTML = ``;
  });

<<<<<<< HEAD
  // document.querySelector('#no-project-btn').addEventListener('pointerdown', (e)=>{
  //     if(e.target.classList.contains('new-project')){
  //         addProject(db, e);
  //     }
  // })
=======
  //Right Panel Stuff

  rightBtn.addEventListener("pointerdown", (e) => {
    const projectId = e.target.getAttribute("data-id");
    if (projectId == "null") {
      return;
    } else if (e.target.classList.contains("add-list-item")) {
      addListItem(db, projectId);
    } else if (!e.target.classList.contains("add-list-item")) {
      createList(db, projectId);
    }
  });

  const rightBackBtn = document.getElementById("right-panel-back");
  rightBackBtn.addEventListener("pointerdown", (e) => {
    if (!e.target.classList.contains("in-list")) return;
    const projectId = rightBtn.getAttribute("data-id");
    e.target.classList.toggle(
      "in-list",
      !e.target.classList.contains("in-list"),
    );
    document.querySelector(".custom-lists").innerHTML = ``;
    const transaction = db.transaction("projects", "readwrite");
    const store = transaction.objectStore("projects");
    const request = store.get(projectId);
    request.onsuccess = (e) => {
      const projectObj = e.target.result;
      displayLists(db, projectObj.id, projectObj.data.lists);
      rightBtn.classList.toggle("add-list-item", false);
      rightBtn.setAttribute("data-list-id", null);
    };
  });

>>>>>>> a739ac0 (update main with development.)
  //? This function handles the saving of the quill data!
  function saveQuillData(contents) {
    saveChapter(db, contents);
  }

  function getProjects() {
    accessProjects(db);
  }

  return [saveQuillData, getProjects];
};

const [saveQuillData, getProjects] = IDB();

export { saveQuillData, getProjects, IDB, db };
