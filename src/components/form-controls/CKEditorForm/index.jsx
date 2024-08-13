import React from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'react-hook-form';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import 'ckeditor5/ckeditor5.css';
import 'ckeditor5-premium-features/ckeditor5-premium-features.css';
import { ClassicEditor,Alignment, BlockQuote, Bold, Essentials, Heading, ImageCaption, ImageStyle, ImageToolbar, ImageUpload, Indent, Italic, List, MediaEmbed, Paragraph, Table, TableToolbar, Undo, Link } from 'ckeditor5';

CKEditorForm.propTypes = {
    form: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    lable: PropTypes.string,
    disabled: PropTypes.bool,
};

function CKEditorForm({ form, name, lable, disabled }) {
    const { formState: { errors } } = form;

    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <>
                    <label>{lable}</label>
                    <CKEditor
                        editor={ClassicEditor}
                        config={{
                            toolbar: {
                                items: [
                                    'heading', '|',
                                    'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                                    'alignment', '|',
                                    'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo',
                                    'indent', 'outdent', '|'
                                ],
                            },
                            plugins: [
                                Essentials, Bold, Italic, Paragraph, Undo, 
                                Heading, Link, List, Alignment, BlockQuote, Table, TableToolbar,
                                Image, ImageToolbar, ImageCaption, ImageStyle, ImageUpload, 
                                MediaEmbed, Indent
                            ],
                            licenseKey: '<YOUR_LICENSE_KEY>',
                            alignment: {
                                options: ['left', 'center', 'right', 'justify']
                            },
                            image: {
                                toolbar: [
                                    'imageTextAlternative', 'imageStyle:full', 'imageStyle:side'
                                ]
                            },
                            mediaEmbed: {
                                previewsInData: true
                            },
                            initialData: '<p>Hello from CKEditor 5 in React!</p>',
                        }}
                        data={field.value}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            field.onChange(data);
                        }}
                        onBlur={() => field.onBlur()}
                        disabled={disabled}
                    />
                    {errors[name] && <p>{errors[name]?.message}</p>}
                </>
            )}
        />
    );
}

export default CKEditorForm;
