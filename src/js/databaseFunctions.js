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

  // Create a transaction for the "projects"/* and "userProjects" object stores -jp
  const projectTransaction = db.transaction(["projects", "userProjects"], "readwrite");
  projectTransaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

  // Add the project to the "projects" store
  const projectStore = projectTransaction.objectStore("projects");
  const project = {
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
  const projectRequest = projectStore.add(project);

  projectRequest.onsuccess = (ev) => {
    console.log("Success in adding project object!", ev);

    // Get the ID of the newly added project
    const projectId = ev.target.result;

    // Create a transaction for the "userProjects" store
    const userProjectsTransaction = db.transaction("userProjects", "readwrite");
    userProjectsTransaction.oncomplete = (ev) => {
      console.log("UserProjects Transaction Completed:", ev);
    };

    // Add a record to "userProjects" to associate the user with the project
    const userProjectsStore = userProjectsTransaction.objectStore("userProjects");
    const userProject = {
      userId: sessionStorage.getItem("userId"),
      projectId: projectId,
    };
    const userProjectRequest = userProjectsStore.add(userProject);

    userProjectRequest.onsuccess = (ev) => {
      console.log("Success in adding userProject object!", ev);

      // Create the project element after both transactions are complete
      createProjectElement(db, e, 0, projectId, projectName);
    };

    userProjectRequest.onerror = (err) => {
      console.log("Error on request to add userProject!", err);
    };
  };

  projectRequest.onerror = (err) => {
    console.log("Error on request to add project!", err);
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
  const loggedInUserId = sessionStorage.getItem("userId");
  const transaction = db.transaction(["userProjects", "projects"], "readonly");
  const userProjects = transaction.objectStore("userProjects");
  const projects = transaction.objectStore("projects");

  transaction.oncomplete = (ev) => {
    console.log("Transaction Completed:", ev);
  };

   // Clear the content of the outline before loading projects
   const outlineContent = document.querySelector(".outline .content");
   outlineContent.innerHTML = "";
 
   // Close the Quill editor
   closeEditor();

  // Step 1: Iterate through userProjects store
  const cursorReq = userProjects.openCursor();
  const associatedProjects = [];

  cursorReq.onsuccess = (e) => {
    const cursor = e.target.result;

    if (cursor) {
      const userProject = cursor.value;

      // Step 2: Check if userId matches loggedInUserId
      if (userProject.userId === loggedInUserId) {
        associatedProjects.push(userProject.projectId);
      }

      cursor.continue();
    } else {
      // Step 3: Iterate through projects store
      const projectCursorReq = projects.openCursor();

      projectCursorReq.onsuccess = (event) => {
        const projectCursor = event.target.result;

        if (projectCursor) {
          const project = projectCursor.value;

          // Step 4: Check if projectId is in associatedProjects array
          if (associatedProjects.includes(project.id)) {
            createProjectElement(db, event, 0, project.id, project.name);
          }

          projectCursor.continue();
        }
      };
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

export { addProject, addChapter, saveChapter, accessProjects};
