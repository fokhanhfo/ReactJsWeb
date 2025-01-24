import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import billApi from 'api/billApi';
import queryString from 'query-string';
import Loading from 'components/Loading';
import BillFilter from '../components/BillFilter';
import BillList from '../components/BillList';
import { Box, Pagination, PaginationItem } from '@mui/material';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';

ListPageBill.propTypes = {};

function ListPageBill(props) {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bills, setBills] = useState([]);
  const [pagination, setPagination] = useState({});

  const queryParams = useMemo(() => {
    const params = queryString.parse(location.search);
    return {
      page: Number.parseInt(params.page) || 1,
      limit: Number.parseInt(params.limit) || 5,
      status: Number.parseInt(params.status) || 1,
      ...params,
    };
  }, [location.search]);

  const fetchBill = async () => {
    setLoading(true);
    const { data, pagination } = await billApi.getAllTest(queryParams);
    setBills(data);
    setPagination(pagination);
    setLoading(false);
  };
  useEffect(() => {
    fetchBill();
  }, [queryParams]);

  const handleChangeFilter = (newfilter) => {
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newfilter),
      },
      { replace: true },
    );
  };

  const handleNextPage = (event, page) => {
    const newFilter = {
      ...queryParams,
      page: page,
    };
    navigate(
      {
        pathname: location.pathname,
        search: queryString.stringify(newFilter),
      },
      { replace: true },
    );
  };

  return (
    <>
      <div className="title">
        <h3>Danh sách hóa đơn</h3>
      </div>
      {!loading ? (
        <>
          <BillFilter filter={queryParams} onSubmit={handleChangeFilter}></BillFilter>
          <div>
            <BillList bills={bills} onUpdateSuccess={fetchBill}></BillList>
          </div>

          <Box display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(pagination.count / pagination.limit)}
              page={Number.parseInt(queryParams.page)}
              onChange={handleNextPage}
              renderItem={(item) => <PaginationItem slots={{ previous: ArrowLeft, next: ArrowRight }} {...item} />}
            />
          </Box>
        </>
      ) : (
        <Loading></Loading>
      )}
    </>
  );
}

export default ListPageBill;
