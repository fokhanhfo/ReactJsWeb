import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
} from "@mui/material";
import { useForm } from "react-hook-form";
import InputField from "components/form-controls/InputForm";
import SelectFrom from "components/form-controls/SelectFrom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const apiUrlCity =
  "https://vietnam-administrative-division-json-server-swart.vercel.app/province";
const apiUrl =
  "https://vietnam-administrative-division-json-server-swart.vercel.app";
const apiEndpointDistrict = apiUrl + "/district/?idProvince=";
const apiEndpointCommune = apiUrl + "/commune/?idDistrict=";

async function getDistrict(idProvince) {
  const { data } = await axios.get(apiEndpointDistrict + idProvince);
  return data;
}

async function getCommune(idDistrict) {
  const { data } = await axios.get(apiEndpointCommune + idDistrict);
  return data;
}

function transformInitialData(data) {
  if (!data) return null;

  const [addressDetail, communeName, districtName, cityName] =
    data.addressDetail.split(",").map((s) => s.trim());

  return {
    fullname: data.recipientName || "",
    phone: data.phone || "",
    addressDetail: addressDetail || "",
    commune: { name: communeName || "", "idCommune": data.idCommune },  // nếu có idCommune thì fill thêm
    district: { name: districtName || "", "idDistrict": data.idDistrict },
    city: { name: cityName || "", "idProvince": data.idProvince },

  };
}


function AddressForm({ open, handleClose, initialData, onSubmit }) {
  const [optionsCity, setOptionsCity] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [communeList, setCommuneList] = useState([]);
  const [isLoadingDistrict, setIsLoadingDistrict] = useState(false);
  const [isLoadingCommune, setIsLoadingCommune] = useState(false);


  const schema = yup
  .object({
    fullname: yup.string().required("Họ và tên là bắt buộc"),
    phone: yup.string().required("Số điện thoại là bắt buộc"),
    city: yup
      .object()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .nullable()
      .required("Thành phố là bắt buộc"),
    district: yup
      .object()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .nullable()
      .required("Quận/Huyện là bắt buộc"),
    commune: yup
      .object()
      .transform((value, originalValue) => (originalValue === "" ? null : value))
      .nullable()
      .required("Xã/Phường là bắt buộc"),
    addressDetail: yup.string().required("Địa chỉ chi tiết là bắt buộc"),
  })
  .required();


  const form = useForm({
  resolver: yupResolver(schema),
  defaultValues: transformInitialData(initialData) || {
    fullname: "",
    phone: "",
    addressDetail: "",
    city: "",
    district: "",
    commune: "",
  },
});



  const { reset, handleSubmit } = form;

  // load danh sách thành phố
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
  useEffect(() => {
        const fetchInitAddressOptions = async () => {
            if (initialData) {
            try {
                if (initialData.idProvince) {
                const districts = await getDistrict(initialData.idProvince);
                setDistrictList(districts);
                }
                if (initialData.idDistrict) {
                const communes = await getCommune(initialData.idDistrict);
                setCommuneList(communes);
                }
            } catch (err) {
                console.error("Error loading initial districts/communes", err);
            }
            }
        };
        fetchInitAddressOptions();
    }, [initialData]);

  console.log('city', optionsCity);
  console.log('districtList', districtList);
  console.log('communeList', communeList);

  useEffect(() => {
    reset(
      transformInitialData(initialData) || {
        fullname: "",
        phone: "",
        addressDetail: "",
        city: "",
        district: "",
        commune: "",
      }
    );
  }, [initialData, reset]);

  const handleChangeProvince = async (provinceObject) => {
    if (Number(provinceObject.idProvince) < 1) {
      setDistrictList([]);
      setCommuneList([]);
      return;
    }
    setIsLoadingDistrict(true);
    const list = await getDistrict(provinceObject.idProvince);
    setDistrictList(list);
    setCommuneList([]); 
    setIsLoadingDistrict(false);
  };

  const handleChangeDistrict = async (districtObject) => {
    if (Number(districtObject.idDistrict) < 1) {
      setCommuneList([]);
      return;
    }
    setIsLoadingCommune(true);
    const list = await getCommune(districtObject.idDistrict);
    setCommuneList(list);
    setIsLoadingCommune(false);
  };

  const onSubmitForm = (data) => {
    if(onSubmit){
      onSubmit(data);
      handleClose();
      if (!initialData) {
        reset({
          fullname: "",
          phone: "",
          addressDetail: "",
          city: "",
          district: "",
          commune: "",
        });
      }
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth>
      <DialogTitle>
        {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <InputField label="Họ và tên" name="fullname" form={form} />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputField label="Số điện thoại" name="phone" form={form} />
            </Grid>
            <Grid item xs={12}>
              <SelectFrom
                transmitId="idProvince"
                onSubmit={handleChangeProvince}
                label="Thành phố"
                name="city"
                form={form}
                options={optionsCity}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectFrom
                transmitId="idDistrict"
                onSubmit={handleChangeDistrict}
                label="Huyện"
                name="district"
                form={form}
                options={districtList}
                // disabled={isLoadingDistrict || districtList.length === 0}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectFrom
                transmitId="idCommune"
                label="Phường/Xã"
                name="commune"
                form={form}
                options={communeList}
                // disabled={isLoadingCommune || communeList.length === 0}
              />
            </Grid>
            <Grid item xs={12}>
              <InputField
                name="addressDetail"
                label="Số nhà, tên đường"
                form={form}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button type="submit" variant="contained">
            Lưu
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddressForm;
