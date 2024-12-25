import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Paper, TextField, Typography } from '@mui/material';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BillAll from './billStatus/billAll';
import PageBillDetail from 'components/billDetail/PageBillDetail';
import BillPending from './billStatus/billPending';
import { useSnackbar } from 'notistack';
import billApi from 'api/billApi';
import { handleGlobalError } from 'utils';
import queryString from 'query-string';

BillUser.propTypes = {};

const StyledTextField = styled(TextField)`
  margin-right: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 10px;
  div {
    height: 100%;
    width: 100%;
  }
  input {
    padding: 0px;
  }
`;

function BillUser(props) {
  const [listBill, setListBill] = useState([]);
  const [pagination, setPagination] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 5,
      status: Number.parseInt(params.status) || null,
      ...params,
    };
  }, [location.search]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await billApi.getAll(queryParams);
        setListBill(res.data);
        setPagination(res.pagination);
      } catch (error) {
        handleGlobalError(error, enqueueSnackbar);
      }
    };

    fetchBills();
  }, [queryParams]);

  const onSubmit = (newFilter) => {
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  return (
    <Box>
      <Box my={2}>
        <Paper>
          <Box display="flex" flexWrap="wrap" justifyContent="space-between" alignItems="center" p={2}>
            <NavLink to="./all">Tất cả</NavLink>
            <NavLink to="./all?status=1">Chờ thanh toán</NavLink>
            <NavLink to="./shipping">Vận chuyển</NavLink>
            <NavLink to="./delivered">Chờ giao hàng</NavLink>
            <NavLink to="./completed">Hoàn thành</NavLink>
            <NavLink to="./cancelled">Đã hủy</NavLink>
            <NavLink to="./returned">Trả hàng/Hoàn tiền</NavLink>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Routes>
          <Route
            path="/all"
            element={
              <BillAll listBill={listBill} onSubmit={onSubmit} queryParams={queryParams} pagination={pagination} />
            }
          />
          <Route path="/:billId" element={<PageBillDetail />} />
          <Route
            path="/:status"
            element={<BillAll listBill={listBill} onSubmit={onSubmit} queryParams={queryParams} />}
          />
          {/* Thêm các route khác nếu cần */}
        </Routes>
      </Box>
    </Box>
  );
}

export default BillUser;
