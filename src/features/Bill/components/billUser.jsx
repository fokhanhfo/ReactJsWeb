import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Paper, TextField, Typography } from '@mui/material';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BillAll from './billStatus/billAll';
import BillPending from './billStatus/billPending';
import { useSnackbar } from 'notistack';
import billApi from 'api/billApi';
import { handleGlobalError } from 'utils';
import queryString from 'query-string';
import PageBillDetail from './PageBillDetail';

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

  const [filter, setFilter] = useState({
    page: 1,
    limit: 5,
  });

  useEffect(() => {
    const params = queryString.parse(location.search);
    if (params.status !== filter.status) {
      setFilter((prev) => ({ ...prev, status: params.status }));
    }
  }, [location.search, filter.status]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await billApi.getAll(filter);
        setListBill(res.data);
        setPagination(res.pagination);
      } catch (error) {
        handleGlobalError(error, enqueueSnackbar);
      }
    };

    fetchBills();
  }, [filter]);

  const onSubmit = (newFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const currentStatus = new URLSearchParams(location.search).get('status');

  const isTabActive = (path) => {
    if (path === '/bill/all' && !currentStatus) return true;
    const matchStatus = new URLSearchParams(path.split('?')[1] || '').get('status');
    return currentStatus === matchStatus;
  };

  return (
    <Box>
      <Box mb={2}>
        <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="space-between"
            alignItems="center"
            p={2}
            sx={{ borderBottom: '1px solid #ddd' }}
          >
            {[
              { label: 'Tất cả', path: './all' },
              { label: 'Chờ phê duyệt', path: './all?status=0' },
              { label: 'Vận chuyển', path: './all?status=2' },
              { label: 'Chờ giao hàng', path: './all?status=3' },
              { label: 'Hoàn thành', path: './all?status=1' },
              { label: 'Đã hủy', path: './all?status=5' },
              { label: 'Trả hàng/Hoàn tiền', path: './all?status=4' },
            ].map((item, index) => {
              const active = isTabActive(item.path);
              return (
                <NavLink
                  key={index}
                  to={item.path}
                  style={{
                    textDecoration: 'none',
                    color: active ? '#fff' : '#555',
                    fontWeight: active ? 'bold' : 'normal',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    backgroundColor: active ? '#000' : 'transparent',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {item.label}
                </NavLink>
              );
            })}
          </Box>
        </Paper>
      </Box>

      <Box>
        <Routes>
          <Route
            path="/all"
            element={<BillAll listBill={listBill} onSubmit={onSubmit} filter={filter} pagination={pagination} />}
          />
          <Route path="/:billId" element={<PageBillDetail />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default BillUser;
