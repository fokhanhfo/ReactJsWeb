'use client';

import { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Stack,
  Paper,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import axios from 'axios';
import InputField from 'components/form-controls/InputForm';
import SelectFrom from 'components/form-controls/SelectFrom';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { CheckoutContext } from './CheckoutProvider';

ShipDetail.propTypes = {
  form: PropTypes.object.isRequired,
};

const apiUrlCity = 'https://vietnam-administrative-division-json-server-swart.vercel.app/province';
const apiUrl = 'https://vietnam-administrative-division-json-server-swart.vercel.app';
const apiEndpointDistrict = apiUrl + '/district/?idProvince=';
const apiEndpointCommune = apiUrl + '/commune/?idDistrict=';

async function getDistrict(idProvince) {
  const { data: districtList } = await axios.get(apiEndpointDistrict + idProvince);
  return districtList;
}

async function getCommune(idDistrict) {
  const { data: communeList } = await axios.get(apiEndpointCommune + idDistrict);
  return communeList;
}

function ShipDetail({ form }) {
  const [optionsCity, setOptionsCity] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);
  const [districtValue, setDistrictValue] = useState(0);
  const [communeValue, setCommuneValue] = useState(0);
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false);
  const [isLoadingCommune, setIsLoadingCommune] = useState(false);
  const { payMethod, setPayMethod } = useContext(CheckoutContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrlCity);
        setOptionsCity(response.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  const handleChangeProvince = async (provinceObject) => {
    if (Number(provinceObject.idProvince) < 1) {
      setDistrictList([]);
      setCommuneList([]);
      setDistrictValue('0');
      setCommuneValue('0');
      return;
    }
    setIsLoadingDistrict(true);
    const districtList = await getDistrict(provinceObject.idProvince);
    setDistrictList(districtList);
    setIsLoadingDistrict(false);
  };

  const handleChangeDistrict = async (districtObject) => {
    setDistrictValue(districtObject.idDistrict);
    if (Number(districtObject.idDistrict) < 1) {
      setCommuneList([]);
      setCommuneValue('0');
    } else {
      setIsLoadingCommune(true);
      const communeList = await getCommune(districtObject.idDistrict);
      setCommuneList(communeList);
      setIsLoadingCommune(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <LocalShippingIcon />
          <Typography variant="h5" fontWeight="bold">
            Thông tin giao hàng
          </Typography>
        </Stack>
        <Divider />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputField label="Họ Và Tên" name="fullname" form={form} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputField label="Phone" name="phone" form={form} />
        </Grid>
        <Grid item xs={12}>
          <InputField label="Email" name="email" form={form} />
        </Grid>

        <Grid item xs={12} md={12}>
          <SelectFrom
            transmitId="idProvince"
            onSubmit={(province) => handleChangeProvince(province)}
            label="Thành Phố"
            name="city"
            form={form}
            options={optionsCity}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectFrom
            transmitId="idDistrict"
            onSubmit={(district) => handleChangeDistrict(district)}
            label="Huyện"
            name="district"
            form={form}
            options={districtList}
            disabled={isLoadingDistrict || districtList.length === 0}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <SelectFrom
            transmitId="idCommune"
            label="Phường/Xã"
            form={form}
            options={communeList}
            name="commune"
            disabled={isLoadingCommune || communeList.length === 0}
          />
        </Grid>

        <Grid item xs={12}>
          <InputField name="addressDetail" label="Số nhà, Tên đường" form={form} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <PaymentIcon />
          <Typography variant="h5" fontWeight="bold">
            Hình thức thanh toán
          </Typography>
        </Stack>
        <Divider />
      </Box>

      <Box sx={{ mt: 1.5 }}>
        <FormControl fullWidth>
          <Controller
            name="paymentMethod"
            control={form.control}
            defaultValue="1"
            render={({ field }) => (
              <RadioGroup {...field}>
                <Stack spacing={1}>
                  {[
                    {
                      value: '3',
                      label: 'Thanh toán thẻ (ATM, Visa)',
                      icon: <CreditCardIcon fontSize="small" sx={{ mr: 1 }} />,
                    },
                    {
                      value: '2',
                      label: 'Thanh toán bằng Shopee Pay',
                      icon: <ShoppingBagIcon fontSize="small" sx={{ mr: 1 }} />,
                    },
                    {
                      value: '1',
                      label: 'Thanh toán khi nhận hàng (COD)',
                      icon: <LocalAtmIcon fontSize="small" sx={{ mr: 1 }} />,
                    },
                  ].map((option, index) => (
                    <Box key={index}>
                      <FormControlLabel
                        value={option.value}
                        control={<Radio size="small" />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {option.icon}
                            <Typography variant="body2" fontWeight={field.value === option.value ? 'bold' : 'normal'}>
                              {option.label}
                            </Typography>
                          </Box>
                        }
                      />
                    </Box>
                  ))}
                </Stack>
              </RadioGroup>
            )}
          />
        </FormControl>
      </Box>
    </Paper>
  );
}

export default ShipDetail;
