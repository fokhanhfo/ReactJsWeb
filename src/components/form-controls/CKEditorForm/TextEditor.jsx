import React from 'react';


import { CKEditor } from '@ckeditor/ckeditor5-react';

export default function TextEditor() {
    const editorConfiguration = {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'imageUpload',
            'blockQuote',
            'insertTable',
            'mediaEmbed',
            'undo',
            'redo',
            'alignment',
            'code',
            'codeBlock',
            'findAndReplace',
            'fontColor',
            'fontFamily',
            'fontSize',
            'fontBackgroundColor',
            'highlight',
            'horizontalLine',
            'htmlEmbed',
            'imageInsert'
        ],
        language: 'en',
        image: {
            toolbar: [
                'imageTextAlternative',
                'toggleImageCaption',
                'imageStyle:inline',
                'imageStyle:block',
                'imageStyle:side'
            ]
        },
        table: {
            contentToolbar: [
                'tableColumn',
                'tableRow',
                'mergeTableCells'
            ]
        }
    };

    return (
        <>
            <CKEditor
                editor={Editor}
                config={editorConfiguration}
                data="<p>Hello from CKEditor 5!</p>"
                onChange={(event, editor) => {
                    const data = editor.getData();
                    console.log(data);
                }}
            />
        </>
    );
}
