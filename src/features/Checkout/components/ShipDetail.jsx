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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
import Address from './Address';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

ShipDetail.propTypes = {
  form: PropTypes.object.isRequired,
};

// const apiUrlCity = 'https://vietnam-administrative-division-json-server-swart.vercel.app/province';
// const apiUrl = 'https://vietnam-administrative-division-json-server-swart.vercel.app';
// const apiEndpointDistrict = apiUrl + '/district/?idProvince=';
// const apiEndpointCommune = apiUrl + '/commune/?idDistrict=';

// async function getDistrict(idProvince) {
//   const { data: districtList } = await axios.get(apiEndpointDistrict + idProvince);
//   return districtList;
// }

// async function getCommune(idDistrict) {
//   const { data: communeList } = await axios.get(apiEndpointCommune + idDistrict);
//   return communeList;
// }

function ShipDetail({ form }) {
  // const [optionsCity, setOptionsCity] = useState([]);
  // const [districtList, setDistrictList] = useState([]);
  // const [communeList, setCommuneList] = useState([]);
  // const [districtValue, setDistrictValue] = useState(0);
  // const [communeValue, setCommuneValue] = useState(0);
  // const [isLoadingDistrict, setIsLoadingDistrict] = useState(false);
  // const [isLoadingCommune, setIsLoadingCommune] = useState(false);
  // const { payMethod, setPayMethod } = useContext(CheckoutContext);
  const [expanded, setExpanded] = useState(false);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get(apiUrlCity);
  //       setOptionsCity(response.data);
  //     } catch (error) {
  //       console.error('Error fetching data: ', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // const handleChangeProvince = async (provinceObject) => {
  //   if (Number(provinceObject.idProvince) < 1) {
  //     setDistrictList([]);
  //     setCommuneList([]);
  //     setDistrictValue('0');
  //     setCommuneValue('0');
  //     return;
  //   }
  //   setIsLoadingDistrict(true);
  //   const districtList = await getDistrict(provinceObject.idProvince);
  //   setDistrictList(districtList);
  //   setIsLoadingDistrict(false);
  // };

  // const handleChangeDistrict = async (districtObject) => {
  //   setDistrictValue(districtObject.idDistrict);
  //   if (Number(districtObject.idDistrict) < 1) {
  //     setCommuneList([]);
  //     setCommuneValue('0');
  //   } else {
  //     setIsLoadingCommune(true);
  //     const communeList = await getCommune(districtObject.idDistrict);
  //     setCommuneList(communeList);
  //     setIsLoadingCommune(false);
  //   }
  // };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Accordion
          expanded={expanded}
          onChange={(_, isExpanded) => setExpanded(isExpanded)}
          sx={{
            boxShadow: 'none',
            border: 'none',
            backgroundColor: 'transparent',
            '&:before': { display: 'none' },
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              backgroundColor: 'transparent',
              padding: 0,
              margin: 0,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <LocalShippingIcon />
              <Typography variant="h5" fontWeight="bold">
                Thông tin giao hàng
              </Typography>
            </Stack>
          </AccordionSummary>

          <AccordionDetails sx={{ p: 0 }}>
            <Divider sx={{ mb: 2 }} />
            <Address expanded={true} />
          </AccordionDetails>
        </Accordion>

        {!expanded && (
          <Box sx={{ mt: 2 }}>
            <Address expanded={false} />
          </Box>
        )}
      </Box>

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
                      label: 'Thanh toán VNPAY',
                      icon: <CreditCardIcon fontSize="small" sx={{ mr: 1 }} />,
                    },
                    // {
                    //   value: '2',
                    //   label: 'Thanh toán bằng Shopee Pay',
                    //   icon: <ShoppingBagIcon fontSize="small" sx={{ mr: 1 }} />,
                    // },
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
