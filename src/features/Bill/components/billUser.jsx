'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { NavLink, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import billApi from 'api/billApi';
import { handleGlobalError } from 'utils';
import queryString from 'query-string';
import PageBillDetail from './PageBillDetail';
import BillAll from './billStatus/billAll';

function BillUser(props) {
  const [listBill, setListBill] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const navigate = useNavigate();

  // Cache để tránh load lại dữ liệu không cần thiết
  const cacheRef = useRef(new Map());
  const lastFetchRef = useRef(null);

  // Theo dõi lần render cuối để tránh fetch trùng lặp
  const lastRenderRef = useRef({
    status: null,
    page: null,
    search: null,
  });

  // Memoize the parsed query params
  const queryParams = useMemo(() => {
    return queryString.parse(location.search);
  }, [location.search]);

  const [filter, setFilter] = useState(() => ({
    page: 1,
    limit: 5,
    status: queryParams.status || undefined,
  }));

  // Tạo cache key để kiểm tra xem đã fetch dữ liệu này chưa
  const createCacheKey = useCallback((filterObj) => {
    return JSON.stringify({
      status: filterObj.status,
      search: filterObj.search,
      page: filterObj.page,
      limit: filterObj.limit,
    });
  }, []);

  // Optimized fetch function với caching
  const fetchBills = useCallback(
    async (currentFilter, forceRefresh = false) => {
      const cacheKey = createCacheKey(currentFilter);

      // Kiểm tra cache nếu không force refresh
      if (!forceRefresh && cacheRef.current.has(cacheKey)) {
        const cachedData = cacheRef.current.get(cacheKey);
        setListBill(cachedData.data);
        setPagination(cachedData.pagination);
        return;
      }

      // Tránh duplicate requests
      if (lastFetchRef.current === cacheKey && isLoading) {
        return;
      }

      setIsLoading(true);
      lastFetchRef.current = cacheKey;

      try {
        const res = await billApi.getAll(currentFilter);

        // Cache kết quả
        cacheRef.current.set(cacheKey, {
          data: res.data,
          pagination: res.pagination,
        });

        setListBill(res.data);
        setPagination(res.pagination);
      } catch (error) {
        handleGlobalError(error, enqueueSnackbar);
      } finally {
        setIsLoading(false);
        lastFetchRef.current = null;
      }
    },
    [enqueueSnackbar, createCacheKey, isLoading],
  );

  // Update filter when URL changes - FIX: Sử dụng deep comparison cho status
  useEffect(() => {
    const urlStatus = queryParams.status;

    setFilter((prev) => {
      // Kiểm tra chính xác để tránh update không cần thiết
      if (String(prev.status) !== String(urlStatus)) {
        return {
          ...prev,
          status: urlStatus,
          page: 1, // Reset page when status changes
        };
      }
      return prev;
    });
  }, [queryParams.status]);

  // Fetch bills when filter changes - FIX: Thêm kiểm tra để tránh fetch trùng lặp
  useEffect(() => {
    // Kiểm tra xem filter có thực sự thay đổi không
    const currentStatus = String(filter.status || '');
    const currentPage = filter.page;
    const currentSearch = filter.search || '';

    const lastStatus = String(lastRenderRef.current.status || '');
    const lastPage = lastRenderRef.current.page;
    const lastSearch = lastRenderRef.current.search || '';

    // Chỉ fetch khi có thay đổi thực sự
    if (currentStatus !== lastStatus || currentPage !== lastPage || currentSearch !== lastSearch) {
      // Cập nhật giá trị cuối
      lastRenderRef.current = {
        status: filter.status,
        page: filter.page,
        search: filter.search,
      };

      // Kiểm tra cache
      const cacheKey = createCacheKey(filter);
      if (cacheRef.current.has(cacheKey)) {
        const cachedData = cacheRef.current.get(cacheKey);
        setListBill(cachedData.data);
        setPagination(cachedData.pagination);
      } else {
        fetchBills(filter);
      }
    }
  }, [filter, fetchBills, createCacheKey]);

  // Optimized onSubmit function
  const onSubmit = useCallback((newFilter) => {
    setFilter((prev) => {
      const updatedFilter = { ...prev, ...newFilter };

      // Chỉ clear cache khi có thay đổi quan trọng
      if (
        (newFilter.search !== undefined && newFilter.search !== prev.search) ||
        (newFilter.status !== undefined && String(newFilter.status) !== String(prev.status))
      ) {
        cacheRef.current.clear();
      }

      return updatedFilter;
    });
  }, []);

  // Memoize tab active check - FIX: Cải thiện logic so sánh cho chuỗi chứa nhiều giá trị
  const isTabActive = useCallback(
    (path) => {
      if (path === './all' && (!queryParams.status || queryParams.status === '')) {
        return true;
      }

      // Xử lý đặc biệt cho path có chứa status
      if (path.includes('?status=')) {
        const pathStatus = path.split('?status=')[1];
        return String(queryParams.status) === String(pathStatus);
      }

      return false;
    },
    [queryParams.status],
  );

  // Memoize tab items
  const tabItems = useMemo(
    () => [
      { label: 'Tất cả', path: './all' },
      { label: 'Đang xử lý', path: './all?status=0,1' },
      { label: 'Đang giao hàng', path: './all?status=2,3' },
      { label: 'Hoàn thành', path: './all?status=5' },
      { label: 'Đã hủy', path: './all?status=6' },
      { label: 'Hoàn tiền', path: './all?status=7' },
    ],
    [],
  );

  // Handle back navigation với cache
  const handleBack = useCallback(() => {
    const returnUrl = localStorage.getItem('bill_return_url');
    if (returnUrl) {
      localStorage.removeItem('bill_return_url');
      const url = new URL(returnUrl);
      navigate(url.pathname + url.search, { replace: true });
    } else {
      navigate(-1);
    }
  }, [navigate]);

  return (
    <Box>
      <Box mb={2}>
        <Paper elevation={3} sx={{ borderRadius: '8px', overflow: 'hidden' }}>
          {/* Thêm thanh cuộn ngang cho mobile */}
          <Box
            sx={{
              overflowX: 'auto',
              scrollbarWidth: 'none' /* Ẩn scrollbar Firefox */,
              '&::-webkit-scrollbar': { display: 'none' } /* Ẩn scrollbar Chrome/Safari */,
              borderBottom: '1px solid #ddd',
            }}
          >
            <Box
              display="flex"
              flexWrap="nowrap" /* Ngăn xuống dòng */
              justifyContent={{ xs: 'flex-start', sm: 'space-between' }} /* Căn trái trên mobile */
              alignItems="center"
              p={1} /* Giảm padding cho mobile */
              minWidth="max-content" /* Giữ nguyên kích thước nội dung */
            >
              {tabItems.map((item, index) => {
                const active = isTabActive(item.path);
                return (
                  <NavLink
                    key={index}
                    to={item.path}
                    style={{
                      textDecoration: 'none',
                      color: active ? '#fff' : '#555',
                      fontWeight: active ? 'bold' : 'normal',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      backgroundColor: active ? '#000' : 'transparent',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap' /* Ngăn chữ xuống dòng */,
                      fontSize: '0.875rem' /* Giảm cỡ chữ */,
                      flexShrink: 0 /* Ngăn co lại */,
                      margin: '0 4px' /* Khoảng cách giữa các tab */,
                    }}
                    onClick={() => {
                      localStorage.setItem('bill_return_url', window.location.href);
                    }}
                  >
                    {item.label}
                  </NavLink>
                );
              })}
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Routes>
          <Route
            path="/all"
            element={
              <BillAll
                listBill={listBill}
                onSubmit={onSubmit}
                filter={filter}
                pagination={pagination}
                isLoading={isLoading}
              />
            }
          />
          <Route path="/:billId" element={<PageBillDetail onBack={handleBack} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default BillUser;
