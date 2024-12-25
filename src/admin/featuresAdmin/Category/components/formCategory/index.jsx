import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from 'components/form-controls/InputForm';
import CKEditorForm from 'components/form-controls/CKEditorForm';
import { Button } from '@mui/material';

FormCategory.propTypes = {
    onSubmit:PropTypes.func.isRequired,
    initialValues: PropTypes.shape({
        name: PropTypes.string,
        description: PropTypes.string,
    }),
    isEdit: PropTypes.bool,
};

function FormCategory({onSubmit,initialValues,isEdit=false}) {

    const schema = yup.object({
        name : yup.string().required('Bắt buộc'),
        description:yup.string().required('Bắt buộc'),
    }).required();

    const form = useForm({
        defaultValues:{
            name:'',
            description:'',
        },
        resolver : yupResolver(schema),
    })

    const handleSubmit = (value)=>{
        if(onSubmit){
            onSubmit(value);
        }
        form.reset();
    };

    useEffect(() => {
        if (initialValues) {
            form.reset({
                name: initialValues.name || '',
                description: initialValues.description || '',
            });
        }
    }, [initialValues, form]);
    return (
        <div>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <InputField name='name' label='Tên danh mục' form={form}/>
                <CKEditorForm name='description' lable='Chi tiết danh mục' form={form}/>
                <Button type='submit'>{!isEdit ? 'Thêm danh mục':'Cập nhật'}</Button>
            </form>
        </div>
    );
}

export default FormCategory;