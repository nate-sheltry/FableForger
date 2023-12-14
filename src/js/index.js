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
  displayLists,
} from "./databaseFunctions.js";
// console.log("Generated unique ID:", guid());

const IDB = () => {
  //? Check if browser supports indexedDB.
  function indexedDBSupport() {
    return "indexedDB" in window;
  }
  if (!indexedDBSupport()) {
    throw new Error("Your browser does not support indexedDB!");
  }
  console.log("indexedDB supported:", indexedDBSupport());

  //? Make a request to open / create a database.
  const DBOpenReq = indexedDB.open("FableForger", 2);

  DBOpenReq.addEventListener("error", (err) => {
    console.warn(err);
  });

  DBOpenReq.addEventListener("success", (ev) => {
    // DB opened... after upgradeneeded.
    db = ev.target.result;
    getProjects();
    console.log("Success", db);
    // buildList();
  });

  DBOpenReq.addEventListener("upgradeneeded", (ev) => {
    // Inside the upgradeneeded is the only place
    // we can add, modify, and delete any data from the DB.
    db = ev.target.result;
    console.log("Upgrade", db);
    let oldVersion = ev.oldVersion;
    let newVersion = ev.newVersion || db.version;
    console.log(
      "DB updated from version",
      oldVersion,
      "to version",
      newVersion,
    );

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

  });

  const leftBtn = document.getElementById("left-panel-btn");
  const rightBtn = document.getElementById("add-custom-list-btn");
  const noProjectBtn = document.getElementById("no-project-btn");

  leftBtn.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("new-project")) {
      addProject(db, e);
    } else if (e.target.classList.contains("new-chapter")) {
      addChapter(db, e);
    }
  });

  noProjectBtn.addEventListener("pointerdown", (e) => {
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

  //Right Panel Stuff

  rightBtn.addEventListener("pointerdown", (e) => {
    const projectId = e.target.getAttribute("data-id");
    if (projectId == "null") {
      console.log("I'm stoopy");
      return;
    } else if (e.target.classList.contains("add-list-item")) {
      addListItem(db, projectId);
      console.log("I'm not stoopy after all");
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
