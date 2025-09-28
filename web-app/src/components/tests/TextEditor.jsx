import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }, { size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ color: [] }, { background: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['clean'],
    ],
};

const formats = [
    'header', 'font', 'size', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'color', 'background', 'list', 'bullet', 'indent', 'align',
];

const TextEditor = React.memo(({ value, onChange, placeholder = 'Enter content...' }) => (
    <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-blue-50 rounded-md"
    />
));

export default TextEditor;