import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { alpha, Box, Button, Divider, Paper, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useParams } from 'react-router-dom';
import { useGetIdDiscountQuery } from 'hookApi/discountApi';
import { Card, CardContent, CircularProgress, Alert, Grid, Chip } from '@mui/material';
import {
  ContentCopy as CopyIcon,
  AccessTime as ClockIcon,
  LocalOffer as TagIcon,
  PercentOutlined as PercentIcon,
  AttachMoney as MoneyIcon,
  ShoppingBag as ShoppingBagIcon,
  CalendarToday as CalendarIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import Loading from 'components/Loading';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import DiscountUser from '../components/DiscountUser';
import { Dashboard as DashboardIcon } from '@mui/icons-material';
import { LocalOffer as DiscountIcon } from '@mui/icons-material';
import { useDeleteDiscountUserMutation } from 'hookApi/discountUserApi';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';

DiscountDetail.propTypes = {};

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function DiscountDetail(props) {
  const [value, setValue] = React.useState(0);
  const { discountId } = useParams();
  const { data, error, isLoading, refetch } = useGetIdDiscountQuery(discountId);
  const discount = data?.data;
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!discount?.discountCode) return;
    navigator.clipboard.writeText(discount.discountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);

  const onSubmit = () => {
    refetch();
  };

  return !isLoading ? (
    <Paper>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#1976d2',
        }}
      >
        <DiscountIcon sx={{ fontSize: 40, mr: 2 }} />
        <Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: 1,
            }}
          >
            Mã Giảm Giá: {discount?.discountCode}
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              mt: 0.5,
              opacity: 0.8,
            }}
          >
            Quản lý và theo dõi mã giảm giá
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ marginY: 2 }} />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Thông tin mã" {...a11yProps(0)} />
            <Tab label="Áp mã" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
              {discount.discountName}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Chip
                label={discount.status === 1 ? 'Hoạt động' : 'Hết hạn'}
                color={discount.status === 1 ? 'success' : 'error'}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Còn lại: {discount.quantity} mã
              </Typography>
            </Box>

            {/* Code section */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                mb: 3,
                bgcolor: 'action.hover',
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <TagIcon color="primary" fontSize="small" />
                <Typography
                  variant="body1"
                  sx={{
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    letterSpacing: 1,
                  }}
                >
                  {discount.discountCode}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                size="small"
                onClick={copyToClipboard}
                startIcon={copied ? <CheckIcon /> : <CopyIcon />}
                sx={
                  copied
                    ? {
                        bgcolor: alpha('#4caf50', 0.1),
                        borderColor: alpha('#4caf50', 0.5),
                        color: '#4caf50',
                      }
                    : {}
                }
              >
                {copied ? 'Đã sao chép!' : 'Sao chép'}
              </Button>
            </Box>

            {/* Details grid */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  {discount.type === 1 ? (
                    <PercentIcon color="primary" fontSize="small" />
                  ) : (
                    <MoneyIcon color="primary" fontSize="small" />
                  )}
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Loại giảm giá
                    </Typography>
                    <Typography variant="body2">{discount.type === 1 ? 'Phần trăm' : 'Tiền mặt'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <PercentIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giá trị
                    </Typography>
                    <Typography variant="body2">{discount.value}%</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <MoneyIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Giảm tối đa
                    </Typography>
                    <Typography variant="body2">{discount.maxValue.toLocaleString()}đ</Typography>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <ShoppingBagIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Điều kiện áp dụng
                    </Typography>
                    <Typography variant="body2">Đơn hàng từ {discount.discountCondition.toLocaleString()}đ</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <CalendarIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Thời gian
                    </Typography>
                    <Typography variant="body2">
                      {dayjs(discount.startTime).format('DD/MM/YYYY HH:mm')} →{' '}
                      {dayjs(discount.endTime).format('DD/MM/YYYY HH:mm')}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                  <ClockIcon color="primary" fontSize="small" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Trạng thái
                    </Typography>
                    <Typography variant="body2" sx={{ color: discount.status === 1 ? 'success.main' : 'error.main' }}>
                      {discount.status === 1 ? 'Còn hạn' : 'Hết hạn'}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          {discount.discountUsers && (
            <DiscountUser
              onSubmit={onSubmit}
              idDiscount={discount.id}
              discountsUser={discount.discountUsers}
              actionsState={actionsState}
            ></DiscountUser>
          )}
        </CustomTabPanel>
      </Box>
    </Paper>
  ) : (
    <Loading></Loading>
  );
}

export default DiscountDetail;
