import React from "react";
import ReactQuill, { Quill } from "react-quill";
import * as ReactDOM from "react-dom/client";
import "react-quill/dist/quill.snow.css";
import makeEditor from "../jsx/richTextEditor";
import { addEntry, getAllEntries, updateEntry, deleteEntry } from "indexManager.js";


makeEditor(".editor");

// console.log(document.querySelector('.ql-font-size .ql-picker-options .ql-picker-item'))
