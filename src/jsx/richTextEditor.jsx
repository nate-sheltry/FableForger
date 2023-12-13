import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import { saveQuillData } from '../js/index.js'

const QuillOb = {editor: {}}

import 'react-quill/dist/quill.snow.css';

let isTextChanged;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote'],

    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction

    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'font-size': ['12px', '13px', '14px', '15px', '16px', '17px', '18px', '20px'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['clean']                                         // remove formatting button
];

const options = {
    theme: 'snow',
    placeholder: 'Compose an epic...',
    readOnly: false,
    modules: {
        toolbar: toolbarOptions
    }
};

const customEffect = (editor) =>{
    const quill = editor;
    //const currentSelect = quill.getSelection();
    console.log('custom effect')
}



function makeEditor(selector){
    const start = performance.now();
    const elem = document.querySelector(selector).parentElement;
    const Editor = new Quill(selector, options)
    QuillOb.editor = Editor;
    const Toolbar = Editor.container.previousSibling;
    console.log(Toolbar.querySelectorAll('.ql-font-size .ql-picker-options .ql-picker-item'))
    let TextChange = null;
    Editor.on('text-change', ()=>{
        isTextChanged = true;
        const currentChapter = sessionStorage.getItem('chapterIndex')
        //clearTimeout(saveTimeout)
        clearTimeout(TextChange);
        TextChange = setTimeout(()=>{
            getEditorData(currentChapter)
        }, 200)
    })
    const end = performance.now();
    console.log(`Result: ${end-start}`)
    return Editor;
}

function getEditorData(chapter){
    if(chapter != sessionStorage.getItem('chapterIndex')){
        return
    }
    console.log('running too much')
    if(!isTextChanged) return null;
    const contents = QuillOb.editor.getContents();
    saveQuillData(contents);
    isTextChanged = false;
    return contents
}

function setEditorData(content){
    console.log(content.ops)
    QuillOb.editor.setText('');
    setTimeout(()=>{unpackData({ops: content.ops})}, 0);
    setTimeout(()=>{QuillOb.editor.history.clear()}, 200)
}

function unpackData(content){
    QuillOb.editor.updateContents(content);
}

function closeEditor(){
    if(QuillOb.editor instanceof Quill){
        QuillOb.editor.off('text-change');
        QuillOb.editor = null
        document.querySelector('.writing-area').innerHTML =`
        <div class="editor">
          <button class="new-project" id="no-project-btn">New Project</button>
        </div>
        `
    }
}

function clearHistory(){
    const history = QuillOb.editor.history
    if(history) history.clear()
}

function getEditorDataSchedule(delay = 5000 ,func){
    let timeoutId;
    return function () {
        console.log('run')
        
        if(!QuillOb.editor || !(QuillOb.editor instanceof Quill)){
            clearTimeout(timeoutId);
            return
        }
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func();
            getEditorDataSchedule(delay, func);
        }, delay);
    };
}

export {
    makeEditor,
    getEditorData,
    setEditorData,
    closeEditor,
    clearHistory
}
