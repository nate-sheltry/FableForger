import React from "react";
import ReactQuill, { Quill } from "react-quill";
import * as ReactDOM from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import makeEditor from "../jsx/richTextEditor";
import {
    addProject,
    getAllProjects,
    updateProject,
    deleteProject,
    addListToProject,
    getAllListsForProject,
    updateList,
    deleteListFromProject,
    addCharacterToProject,
    getAllCharactersForProject,
    updateCharacter,
    deleteCharacterFromProject,
    addLocationToProject,
    getAllLocationsForProject,
    updateLocation,
    deleteLocationFromProject,
    addChapterToProject,
    getAllChaptersForProject,
    updateChapter,
    deleteChapterFromProject
  } from "./indexManager.js";

makeEditor(".editor");

// console.log(document.querySelector('.ql-font-size .ql-picker-options .ql-picker-item'))
