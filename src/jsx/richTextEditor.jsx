import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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
    debug: 'info',
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
    const Editor = new Quill(selector, options)
    const Toolbar = Editor.container.previousSibling;
    const fontSizeOptions = Toolbar.querySelectorAll('.ql-font-size .ql-picker-options .ql-picker-item');
    for(let i = 0; i < fontSizeOptions.length; i++){
        fontSizeOptions[i].textContent = fontSizeOptions[i].getAttribute('data-value');
        fontSizeOptions[i].addEventListener('click', ()=>{customEffect(Editor)})
    }
    console.log(Toolbar.querySelectorAll('.ql-font-size .ql-picker-options .ql-picker-item'))
    const end = performance.now();
    console.log(`Result: ${end-start}`)
}

export default makeEditor;

const isMonotonic = function(nums){
    const start = performance
    let increasing = false;
    let decreasing = false;
    for(let i = 0; i < nums.length - 1; i++){
        if(nums[i] > nums[i+1]){
            increasing = true;
        }
        else if(nums[i] < nums[i+1]){
            decreasing = true;
        }
        if(increasing && decreasing){
            break;
        }
    }
    return !increasing || !decreasing
}
