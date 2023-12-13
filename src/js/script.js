import React from "react";
import ReactQuill, { Quill } from "react-quill";
import * as ReactDOM from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import { getProjects } from "./index.js";
import {
  makeEditor,
  getEditorData,
  setEditorData,
} from "../jsx/richTextEditor.jsx";
import {
  addProject,
  getAllProjects,
  updateProject,
  deleteProject,
} from "./indexManager.js";

//getProjects();

// makeEditor(".editor");

// console.log(document.querySelector('.ql-font-size .ql-picker-options .ql-picker-item'))
