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
  displayLists
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
      newVersion
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

    // db.createObjectStore("", {
    //     keyPath: "id"
    // });
    // if(db.objectStoreNames.contains("")){
    //     db.deleteObjectStore("");
  });
  const leftBtn = document.getElementById("left-panel-btn");
  const rightBtn = document.getElementById("add-custom-list-btn");
  const noProjectBtn = document.getElementById("no-project-btn");


  leftBtn.addEventListener("click", (e) => {
    if (e.target.classList.contains("new-project")) {
      addProject(db, e);
    } else if (e.target.classList.contains("new-chapter")) {
      addChapter(db, e);
    }
  });

  noProjectBtn.addEventListener("click", (e) => {
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
    const editor = document.querySelector(".writing-area")
    editor.classList.toggle("no-area", !editor.classList.contains("no-area"))
    editor.classList.toggle("editor-area", !editor.classList.contains("editor-area"))
    document.querySelector(".outline .subtitle").textContent = "Projects";
    const noProjectBtn = document.getElementById('no-project-btn');
    noProjectBtn.addEventListener("click", (e) => {
        addProject(db, e);
    });
    rightBtn.setAttribute("data-id", null)

    document.querySelector(".custom-lists").innerHTML = ``;
  });

  //Right Panel Stuff
 
  rightBtn.addEventListener("pointerdown", (e) => {
    const projectId = e.target.getAttribute("data-id")
    if(projectId == "null") {
      console.log("I'm stoopy")
      return;
    }
    else if(e.target.classList.contains("add-list-item")){
      addListItem(db, projectId)
      console.log("I'm not stoopy after all")
    }
    else if(!e.target.classList.contains("add-list-item")){
      createList(db, projectId);
    }

  })

  const rightBackBtn = document.getElementById("right-panel-back");
  rightBackBtn.addEventListener("pointerdown", (e) => {
    if(!e.target.classList.contains("in-list")) return;
    const projectId = rightBtn.getAttribute("data-id");
    e.target.classList.toggle("in-list", !e.target.classList.contains("in-list"));
    document.querySelector(".custom-lists").innerHTML = ``;
    const transaction = db.transaction("projects", "readwrite");
    const store = transaction.objectStore("projects");
    const request = store.get(projectId)
    request.onsuccess = (e) =>{
      const projectObj = e.target.result;
      displayLists(db, projectObj.id, projectObj.data.lists)
      rightBtn.classList.toggle("add-list-item", false);
      rightBtn.setAttribute("data-list-id", null);
    }
  })


  // document.querySelector('#no-project-btn').addEventListener('pointerdown', (e)=>{
  //     if(e.target.classList.contains('new-project')){
  //         addProject(db, e);
  //     }
  // })
  //? This function handles the saving of the quill data!
  function saveQuillData(contents) {
    saveChapter(db, contents);
  }

  // document.getElementById("btnAdd").addEventListener("click", (ev) => {
  //     ev.preventDefault();

  //     let bookname = document.getElementById("bookname").value.trim();
  //     let author = document.getElementById("author").value.trim();
  //     let aboutBook = document.getElementById("aboutBook").value.trim();
  //     let owned = document.getElementById("isOwned").checked;

  //     let book = {
  //         id: guid(),
  //         name: bookname,
  //         author: author,
  //         about: aboutBook,
  //         isOwned: owned
  //     };

  //     let transaction = makeTransaction("bookStore", "readwrite");
  //     transaction.oncomplete = (ev) => {
  //         console.log("Transaction Completed:", ev);
  //         buildList();
  //         clearForm();
  //     }

  //     let store = transaction.objectStore("bookStore");
  //     let storeRequest = store.add(book);

  //     storeRequest.onsuccess = (ev) =>{
  //         console.log("Success in adding object!", ev);
  //     }

  //     storeRequest.onerror = (err) => {
  //         console.log("Error on request to add!", err);
  //     }
  // })

  // document.getElementById("btnUpdate").addEventListener("click", (ev) => {
  //     ev.preventDefault();
  //     let bookname = document.getElementById("bookname").value.trim();
  //     let author = document.getElementById("author").value.trim();
  //     let aboutBook = document.getElementById("aboutBook").value.trim();
  //     let owned = document.getElementById("isOwned").checked;

  //     let key = document.bookForm.getAttribute("data-key");
  //     if(key) {
  //         let book = {
  //             id: key,
  //             name: bookname,
  //             author: author,
  //             about: aboutBook,
  //             isOwned: owned
  //         };

  //         let transaction = makeTransaction("bookStore", "readwrite");
  //         transaction.oncomplete = (ev) => {
  //             console.log("Transaction Completed:", ev);
  //             buildList();
  //             clearForm();
  //         }

  //         let store = transaction.objectStore("bookStore");
  //         let storeRequest = store.put(book);

  //         storeRequest.onsuccess = (ev) =>{
  //             console.log("Success in updating object!", ev);
  //         }

  //         storeRequest.onerror = (err) => {
  //             console.log("Error on request to update!", err);
  //         }
  //     }
  // })

  // document.getElementById("btnDelete").addEventListener("click", (ev) => {
  //     ev.preventDefault();
  //     let key = document.bookForm.getAttribute("data-key");
  //     if(key) {
  //         console.log("This is my key:", key);
  //         let transaction = makeTransaction("bookStore", "readwrite");
  //         transaction.oncomplete = (ev) => {
  //             console.log("Transaction Completed:", ev);
  //             clearForm();
  //         }

  //         let store = transaction.objectStore("bookStore");
  //         let storeRequest = store.delete(key);

  //         storeRequest.onsuccess = (ev) =>{
  //             console.log("Success in deleting object!", ev);
  //         }

  //         storeRequest.onerror = (err) => {
  //             console.log("Error on request to delete!", err);
  //         }
  //     }
  // })

  // document.getElementById("btnClear").addEventListener("click", clearForm);
  // function clearForm(ev) {
  //     if(ev) {
  //         ev.preventDefault()
  //     };
  //     document.bookForm.reset();
  // }

  // function buildList() {
  //     let list = document.querySelector(".list-bar");
  //     list.innerHTML = `<li class="loading"> Loading... </li>`;
  //     let transaction = makeTransaction("bookStore", "readonly");
  //     transaction.oncomplete = (ev) => {

  //     }

  //     let store = transaction.objectStore("bookStore");
  //     let getRequest = store.getAll();

  //     getRequest.onsuccess = (ev) => {
  //         let req = ev.target;
  //         console.log("get req:", req);
  //         list.innerHTML = req.result.map(book => {
  //             return `<li class="listOfBooks" data-key="${book.id}"><a href"#">${book.name} ${book.author}</a></li>`;
  //         }).join("\n");
  //     }
  //     getRequest.onerror = (err) => {
  //         console.warn("Error", err);
  //     }
  // }

  // document.querySelector(".list-bar").addEventListener("click", (ev) => {
  //     let li = ev.target.closest("[data-key]");
  //     let id = li.getAttribute("data-key");
  //     console.log("List and Id:", li , id);

  //     let transaction = makeTransaction("bookStore", "readonly");
  //     transaction.oncomplete = () => {

  //     }

  //     let store = transaction.objectStore("bookStore");
  //     let req = store.get(id);
  //     req.onsuccess = (ev) => {
  //         let request = ev.target;
  //         let book = request.result;
  //         document.getElementById("bookname").value = book.name;
  //         document.getElementById("author").value = book.author;
  //         document.getElementById("aboutBook").value = book.about;
  //         document.getElementById("isOwned").checked = book.isOwned;
  //         document.bookForm.setAttribute("data-key", book.id)
  //     }

  //     req.onerror = (err) => {
  //         console.warn("Error", err)
  //     }

  // });
  function getProjects() {
    accessProjects(db);
  }

  return [saveQuillData, getProjects];
};

const [saveQuillData, getProjects] = IDB();

export { saveQuillData, getProjects, IDB, db};
