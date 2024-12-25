import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import billApi from 'api/billApi';
import { useSnackbar } from 'notistack';
import Loading from 'components/Loading';
import { Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import BillDetail from 'components/billDetail/BillDetail';
import UserInformation from 'components/billDetail/UserInformation';

PageBillDetail.propTypes = {};

function PageBillDetail(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { billId } = useParams();
  const [bill, setBill] = useState({});
  const [isloading, setIsLoading] = useState(true);
  const fetchBillId = async () => {
    const response = await billApi.get(billId);
    if (response) {
      setBill(response.data);
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  };
  useEffect(() => {
    fetchBillId();
  }, []);

  return (
    <div>
      {isloading ? (
        <Loading></Loading>
      ) : (
        <Box>
          <div className="title">
            <h3>Thông tin chi tiết hóa đơn</h3>
          </div>
          <UserInformation bill={bill}></UserInformation>
          <BillDetail billDetail={bill.billDetail}></BillDetail>
        </Box>
      )}
    </div>
  );
}

export default PageBillDetail;
