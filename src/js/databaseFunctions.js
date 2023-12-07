import { guid } from "./uid.js";
import {
  makeEditor,
  getEditorData,
  setEditorData,
  closeEditor,
  clearHistory,
} from "../jsx/richTextEditor.jsx";

function makeTransaction(db, storeName, mode) {
  let transaction = db.transaction(storeName, mode);
  transaction.onerror = (err) => {
    console.warn(err);
  };
  return transaction;
}

function addProject(db, e) {
  let projectName = false;
  do {
    projectName = prompt("Enter new Project Name");
    try {
      projectName = projectName.trim();
    } catch (err) {
      return;
    }
    if (!!projectName == false) alert("please enter a valid name.");
  } while (!projectName);

  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  let project = {
    id: guid(),
    name: projectName,
    data: {
      chapters: [
        {
          content: {
            ops: [
              { insert: "Chapter Title" },
              { attributes: { align: "center", header: 3 }, insert: "\n" },
            ],
          },
        },
      ],
    },
  };
  const store = transaction.objectStore("projects");
  const storeRequest = store.add(project);
  storeRequest.onsuccess = (ev) => {
    console.log("Success in adding object!", ev);
    createProjectElement(db, e, 0, project.id, project.name);
  };
  storeRequest.onerror = (err) => {
    console.log("Error on request to add!", err);
  };
}

function addChapter(db, event) {
  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const store = transaction.objectStore("projects");
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  const projectReq = store.get(projectId);
  projectReq.onsuccess = (e) => {
    const projectObj = JSON.parse(JSON.stringify(e.target.result));
    projectObj.data.chapters.push({
      content: {
        ops: [
          { insert: "Chapter Title" },
          { attributes: { align: "center", header: 3 }, insert: "\n" },
        ],
      },
      index: projectObj.data.chapters.length,
    });
    const storeRequest = store.put(projectObj);
    storeRequest.onsuccess = (ev) => {
      console.log("Success in adding object!", ev);
      createChapterElement(
        db,
        e,
        projectObj.data.chapters.length - 1,
        `Chapter ${projectObj.data.chapters.length}`,
      );
      sessionStorage.setItem(
        "chapterIndex",
        parseInt(projectObj.data.chapters.length - 1),
      );
      loadChapter(db);
    };
    storeRequest.onerror = (err) => {
      console.log("Error on request to add!", err);
    };
  };
}

function createProjectElement(db, event, index, id, projectName) {
  const projectItem = document.createElement("a");
  projectItem.textContent = `- ${projectName}`;
  projectItem.classList.toggle("project-item", true);
  projectItem.setAttribute("data-id", id);
  document.querySelector(".outline .content").append(projectItem);
  projectItem.addEventListener("pointerdown", (e) => {
    const subtitleElem = document.querySelector(".outline .subtitle");
    subtitleElem.textContent = projectName;
    subtitleElem.setAttribute("data-id", id);
    const btn = document.querySelector("#left-panel-btn");

    sessionStorage.setItem("chapterIndex", index);

    btn.classList.toggle("new-project", false);
    btn.classList.toggle("new-chapter", true);

    document.querySelector(".outline .content").innerHTML = ``;
    accessChapters(db, id);
    makeEditor(".editor");
    loadChapter(db);
  });
}

function createChapterElement(db, event, index, projectName) {
  const chapterItem = document.createElement("a");
  chapterItem.textContent = `- ${projectName}`;
  chapterItem.classList.toggle("chapter-item", true);
  chapterItem.setAttribute("data-index", index);
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  chapterItem.setAttribute("project-id", projectId);
  document.querySelector(".outline .content").append(chapterItem);
  chapterItem.addEventListener("pointerdown", (e) => {
    sessionStorage.setItem(
      "chapterIndex",
      parseInt(e.target.getAttribute("data-index")),
    );
    loadChapter(db);
  });
}

function loadChapter(db) {
  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const chapterIndex = parseInt(sessionStorage.getItem("chapterIndex"));
  const store = transaction.objectStore("projects");
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");
  const projectReq = store.get(projectId);
  projectReq.onsuccess = (e) => {
    clearHistory();
    const projectObj = JSON.parse(JSON.stringify(e.target.result));
    setEditorData(projectObj.data.chapters[chapterIndex].content);
  };
}

function saveChapter(db, newContent) {
  const transaction = makeTransaction(db, "projects", "readwrite");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const store = transaction.objectStore("projects");
  const projectId = document
    .querySelector(".outline .subtitle")
    .getAttribute("data-id");

  const chapterIndex = parseInt(sessionStorage.getItem("chapterIndex"));

  const projectReq = store.get(projectId);

  projectReq.onsuccess = (e) => {
    const projectObj = JSON.parse(JSON.stringify(e.target.result));
    projectObj.data.chapters[chapterIndex]["content"] = newContent;
    const storeRequest = store.put(projectObj);
    storeRequest.onsuccess = (ev) => {
      console.log("Success in updating Chapter!", ev);
    };
    storeRequest.onerror = (err) => {
      console.log("Error on request to add!", err);
    };
  };
}

function accessProjects(db) {
  const transaction = db.transaction(["projects"], "readonly");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const store = transaction.objectStore("projects");
  const cursorReq = store.openCursor();
  document.querySelector(".outline .content").innerHTML = ``;
  closeEditor();
  cursorReq.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor) {
      createProjectElement(db, e, 0, cursor.value.id, cursor.value.name);
      cursor.continue();
    }
  };
}

function accessChapters(db, id) {
  const transaction = db.transaction(["projects"], "readonly");
  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };
  const store = transaction.objectStore("projects");
  const projectReq = store.get(id);
  projectReq.onsuccess = (e) => {
    const projectObj = e.target.result;
    for (let i = 0; i < projectObj.data.chapters.length; i++) {
      projectObj.data.chapters[i];
      createChapterElement(db, e, i, `Chapter ${i + 1}`);
    }
  };
}

export { addProject, addChapter, saveChapter, accessProjects };
