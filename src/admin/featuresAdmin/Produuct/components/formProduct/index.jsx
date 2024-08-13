    import React, { useEffect, useState } from 'react';
    import PropTypes from 'prop-types';
    import * as yup from 'yup';
    import { Controller, useForm } from 'react-hook-form';
    import { yupResolver } from '@hookform/resolvers/yup';
    import InputField from 'components/form-controls/InputForm';
    import CKEditorForm from 'components/form-controls/CKEditorForm';
    import { Button } from '@mui/material';
    import SelectFrom from 'components/form-controls/SelectFrom';
    import categoryApi from 'api/categoryApi';
    import Loading from 'components/Loading';
import FileForm from 'components/form-controls/FileForm';

    FormProduct.propTypes = {
        onSubmit: PropTypes.func,
    };

    function FormProduct({onSubmit}) {
        const [category,setCategory]= useState([]);
        const [isLoading,setIsLoading] = useState(false);
        useEffect(()=>{
            const fetchCategory = async()=>{
                try{
                    setIsLoading(true);
                    const response = await categoryApi.getAll();
                    setCategory(response.data);
                }catch(e){
                    console.error(e);
                }
                setIsLoading(false);
            }
            fetchCategory();
        },[]);


        const schema = yup
        .object({
            name:yup.string().required('Băt buộc'),
            detail:yup.string().required('Bắt buộc'),
            price:yup.number().required('Bắt buộc'),
            quantity:yup.number().required('Bắt buộc'),
            category:yup.string().required('Bắt buộc'),
            file:yup.mixed().required('Bắt Buộc'),
        }).required();

        const form = useForm({
            defaultValues:{
                name:'',
                detail:'',
                price:'',
                quantity:'',
                category:'',
                file:null,
            },
            resolver : yupResolver(schema),
        });

        const handleSubmit = (values) => {
            console.log('đã vào');
            if(onSubmit){
                const formData = new FormData();
                formData.append('name', values.name);
                formData.append('detail', values.detail);
                formData.append('price', values.price);
                formData.append('quantity', values.quantity);
                formData.append('category', values.category);
                if (values.file && values.file.length > 0) {
                    for (let i = 0; i < values.file.length; i++) {
                        formData.append('images', values.file[i]);
                    }
                }
                onSubmit(formData);
            }
            form.reset();
        };

        return (
            <div>
                {isLoading ? <Loading/> :
                    <form onSubmit={form.handleSubmit(handleSubmit)}>
                        <InputField name='name' label='Tên sản phẩm' form={form}></InputField>
                        <CKEditorForm name='detail' lable='Chi tiết sản phẩm' form={form} />
                        <InputField name='price' label='Giá tiền' form={form}/>
                        <InputField name='quantity' label='Số lượng sản phẩm' form={form} />
                        <SelectFrom name='category' label='Danh mục' form={form} options={category}/>
                        <FileForm name='file'form={form}/>
                        <Button type='submit'>Thêm sản phẩm</Button>
                    </form>
                }
            </div>
        );
    }

    export default FormProduct;