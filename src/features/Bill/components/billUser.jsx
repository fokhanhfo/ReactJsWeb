'use client';
import { useMemo, useCallback } from 'react';
import { Box, Paper, Tab, Tabs, useTheme, useMediaQuery } from '@mui/material';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import PageBillDetail from './PageBillDetail';
import BillAll from './billStatus/billAll';
import BillProcessing from './billStatus/billProcessing';
import BillDelivering from './billStatus/billDelivering';
import BillComplete from './billStatus/billComplete';
import BillCancel from './billStatus/BillCancel';
import BillRefund from './billStatus/billRefund';

function BillUser() {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  // Responsive breakpoints
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  // Memoize the parsed query params
  const queryParams = useMemo(() => {
    return queryString.parse(location.search);
  }, [location.search]);

  const tabItems = useMemo(
    () => [
      { label: 'Tất cả', path: './all' },
      { label: 'Đang xử lý', path: './processing' },
      { label: 'Đang giao hàng', path: './delivering' },
      { label: 'Hoàn thành', path: './complete' },
      { label: 'Đã hủy', path: './cancel' },
      { label: 'Hoàn tiền', path: './refund' },
    ],
    [],
  );

  const getCurrentTabIndex = useCallback(() => {
    const currentPath = location.pathname;
    const activeIndex = tabItems.findIndex((item) => currentPath.includes(item.path.replace('./', '')));
    return activeIndex >= 0 ? activeIndex : 0;
  }, [location.pathname, tabItems]);

  const handleTabChange = useCallback(
    (event, newValue) => {
      const selectedTab = tabItems[newValue];
      localStorage.setItem('bill_return_url', window.location.href);
      navigate(selectedTab.path);
    },
    [navigate, tabItems],
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

  // Responsive tab styles
  const getTabsStyles = () => ({
    '& .MuiTabs-root': {
      minHeight: isMobile ? 40 : 48,
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#000',
      height: isMobile ? 2 : 3,
    },
    '& .MuiTab-root': {
      textTransform: 'none',
      minWidth: isMobile ? 80 : 120,
      minHeight: isMobile ? 40 : 48,
      padding: isMobile ? '8px 12px' : '12px 20px',
      fontSize: isMobile ? '0.75rem' : isTablet ? '0.8rem' : '0.875rem',
      fontWeight: 500,
      color: '#666',
      '&.Mui-selected': {
        color: '#000',
        fontWeight: 700,
      },
      '&:hover': {
        color: '#333',
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      },
    },
    '& .MuiTabs-scrollButtons': {
      '&.Mui-disabled': {
        opacity: 0.3,
      },
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '100vw',
        overflow: 'hidden',
      }}
    >
      {/* Tab Navigation */}
      <Box
        mb={isMobile ? 1 : 2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'background.default',
        }}
      >
        <Paper
          elevation={isMobile ? 1 : 3}
          sx={{
            borderRadius: isMobile ? '4px' : '8px',
            overflow: 'hidden',
            boxShadow: isMobile ? '0 1px 3px rgba(0,0,0,0.1)' : undefined,
          }}
        >
          <Box
            sx={{
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollbarWidth: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              borderBottom: '1px solid #ddd',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <Box
              display="flex"
              flexWrap="nowrap"
              justifyContent="flex-start"
              alignItems="center"
              sx={{
                minWidth: 'max-content',
                px: isMobile ? 0.5 : 1,
                py: isMobile ? 0.5 : 1,
              }}
            >
              <Tabs
                value={getCurrentTabIndex()}
                onChange={handleTabChange}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons={isMobile || isTablet ? 'auto' : false}
                allowScrollButtonsMobile={true}
                fullWidth={!isMobile}
                sx={{
                  ...getTabsStyles(),
                  ...(isTablet || (!isMobile && !isTablet) ? { width: '100%' } : {}),
                  display: 'flex', // thêm
                  justifyContent: 'space-between', // chia đều
                }}
                TabIndicatorProps={{
                  style: {
                    transition: 'all 0.3s ease',
                  },
                }}
              >
                {tabItems.map((item, index) => (
                  <Tab
                    key={index}
                    label={item.label}
                    id={`tab-${index}`}
                    aria-controls={`tabpanel-${index}`}
                    sx={{
                      flex: 1, // thêm: mỗi tab chiếm đều không gian
                      ...(isMobile && {
                        '&:first-of-type': {
                          marginLeft: '4px',
                        },
                        '&:last-of-type': {
                          marginRight: '4px',
                        },
                      }),
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Content Area */}
      <Box
        sx={{
          pb: isMobile ? 2 : 3,
          minHeight: 'calc(100vh - 200px)',
        }}
      >
        <Routes>
          <Route path="/all" element={<BillAll />} />
          <Route path="/processing" element={<BillProcessing />} />
          <Route path="/delivering" element={<BillDelivering />} />
          <Route path="/complete" element={<BillComplete />} />
          <Route path="/cancel" element={<BillCancel />} />
          <Route path="/refund" element={<BillRefund />} />
          <Route path="/:billId" element={<PageBillDetail onBack={handleBack} />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default BillUser;
