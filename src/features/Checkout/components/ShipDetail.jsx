import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Paper, Select, Typography } from '@mui/material';
import InputField from 'components/form-controls/InputForm';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import SelectFrom from 'components/form-controls/SelectFrom';
import styled from 'styled-components';

ShipDetail.propTypes = {
    
};

const StyledTypography = styled(Typography)`
    font-size:20px;
    font-weight:bold;
    padding-top:10px;
`
 
const apiUrlCity = "https://vietnam-administrative-division-json-server-swart.vercel.app/province";
const apiUrl = "https://vietnam-administrative-division-json-server-swart.vercel.app";
const apiEndpointDistrict = apiUrl + "/district/?idProvince=";
const apiEndpointCommune = apiUrl + "/commune/?idDistrict=";
async function getDistrict(idProvince) {
    const { data: districtList } = await axios.get(
      apiEndpointDistrict + idProvince
    );
    return districtList;
  }
async function getCommune(idDistrict) {
const { data: communeList } = await axios.get(
    apiEndpointCommune + idDistrict
);
return communeList;
}

function ShipDetail(props) { 
    const [optionsCity,setOptionsCity] = useState([]); 
    const [districtList, setDistrictList] = React.useState([]);
    const [communeList, setCommuneList] = React.useState([]);
    const [districtValue, setDistrictValue] = React.useState(0);
    const [communeValue, setCommuneValue] = React.useState(0);
    
    const [isLoadingDistrict, setIsLoadingDistrict] = React.useState(false);
    const [isLoadingCommune, setIsLoadingCommune] = React.useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(apiUrlCity);
                setOptionsCity(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, []);
    const schema = yup
    .object({

    })
    .required();

    const form = useForm({
        defaultValues: {
          fullname: '',
          email: '',
          phone:'',
          city:'',
          district:'',
          commune:'',
        },
        resolver: yupResolver(schema),
      });
    
      const handleChangeProvince = async (id) => {
        if (Number(id) < 1) {
            setDistrictList([]);
            setCommuneList([]);
            setDistrictValue("0");
            setCommuneValue("0");
            return;
        }
        setIsLoadingCommune(true);
        const districtList = await getDistrict(id);
        setDistrictList(districtList);
        setIsLoadingDistrict(false);
        console.log(districtList);
      };

      const handleChangeDistrict = async (id) => {
        setDistrictValue(id);
        if (Number(id) < 1) {
          setCommuneList([]);
          setCommuneValue("0");
        } else {
          setIsLoadingCommune(true);
          const communeList = await getCommune(id);
          setCommuneList(communeList);
          setIsLoadingCommune(false);
        }
      };

    return (
        <Paper>
            <StyledTypography>Thông tin giao dịch</StyledTypography>
            <InputField label='Họ Và Tên' name='fullname' form={form}></InputField>
            <InputField label='Email' name='email' form={form}></InputField>
            <InputField label='Phone' name='phone' form={form}></InputField>
            <SelectFrom id='idProvince' onSubmit={(id)=>handleChangeProvince(id)} label='Thành Phố' name='city' form={form} options={optionsCity}></SelectFrom>
            <SelectFrom id='idDistrict' onSubmit={(id)=>handleChangeDistrict(id)} label='Huyện' name='district' form={form} options={districtList}></SelectFrom>
            <SelectFrom id='idCommune' label='Chọn Phường/Xã' form={form} options={communeList} name='commune'></SelectFrom>
        </Paper>
    );
}

export default ShipDetail;