import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Paper,
  Container,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { useGetBillStatisticsDashboardQuery, useGetRevenueByCategoryQuery } from 'hookApi/billApi';
import { useGetStatCardDashboardQuery, useTopSellingProductsQuery } from 'hookApi/dashboard';
import React, { useEffect, useState } from 'react';
import {
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from 'recharts';

// Dữ liệu mẫu phong phú hơn
const monthlyRevenue = [
  { month: 'T1', revenue: 45000, orders: 120, customers: 89, avgOrder: 375 },
  { month: 'T2', revenue: 52000, orders: 135, customers: 102, avgOrder: 385 },
  { month: 'T3', revenue: 48000, orders: 128, customers: 95, avgOrder: 375 },
  { month: 'T4', revenue: 61000, orders: 165, customers: 125, avgOrder: 370 },
  { month: 'T5', revenue: 55000, orders: 142, customers: 108, avgOrder: 387 },
  { month: 'T6', revenue: 67000, orders: 178, customers: 134, avgOrder: 376 },
  { month: 'T7', revenue: 72000, orders: 195, customers: 148, avgOrder: 369 },
  { month: 'T8', revenue: 68000, orders: 182, customers: 139, avgOrder: 374 },
  { month: 'T9', revenue: 75000, orders: 203, customers: 156, avgOrder: 369 },
  { month: 'T10', revenue: 82000, orders: 225, customers: 172, avgOrder: 364 },
  { month: 'T11', revenue: 89000, orders: 245, customers: 189, avgOrder: 363 },
  { month: 'T12', revenue: 95000, orders: 268, customers: 205, avgOrder: 355 },
];

const productCategories = [
  { name: 'Áo thun', value: 35, color: '#8884d8', revenue: 280000 },
  { name: 'Quần jeans', value: 25, color: '#82ca9d', revenue: 200000 },
  { name: 'Váy', value: 20, color: '#ffc658', revenue: 160000 },
  { name: 'Áo khoác', value: 15, color: '#ff7300', revenue: 120000 },
  { name: 'Phụ kiện', value: 5, color: '#00ff88', revenue: 40000 },
];

const salesBySize = [
  { size: 'XS', sales: 120, revenue: 48000 },
  { size: 'S', sales: 280, revenue: 112000 },
  { size: 'M', sales: 450, revenue: 180000 },
  { size: 'L', sales: 380, revenue: 152000 },
  { size: 'XL', sales: 220, revenue: 88000 },
  { size: 'XXL', sales: 150, revenue: 60000 },
];

const quarterlyData = [
  { quarter: 'Q1 2023', revenue: 145000, profit: 32000, growth: 12.5 },
  { quarter: 'Q2 2023', revenue: 183000, profit: 41000, growth: 26.2 },
  { quarter: 'Q3 2023', revenue: 215000, profit: 48000, growth: 17.5 },
  { quarter: 'Q4 2023', revenue: 266000, profit: 58000, growth: 23.7 },
];

// Dữ liệu mới
const hourlyTraffic = [
  { hour: '00', visits: 45, sales: 12 },
  { hour: '01', visits: 32, sales: 8 },
  { hour: '02', visits: 28, sales: 5 },
  { hour: '03', visits: 25, sales: 3 },
  { hour: '04', visits: 30, sales: 7 },
  { hour: '05', visits: 42, sales: 15 },
  { hour: '06', visits: 68, sales: 25 },
  { hour: '07', visits: 95, sales: 38 },
  { hour: '08', visits: 125, sales: 52 },
  { hour: '09', visits: 158, sales: 68 },
  { hour: '10', visits: 185, sales: 82 },
  { hour: '11', visits: 195, sales: 89 },
  { hour: '12', visits: 210, sales: 95 },
  { hour: '13', visits: 205, sales: 92 },
  { hour: '14', visits: 198, sales: 88 },
  { hour: '15', visits: 185, sales: 85 },
  { hour: '16', visits: 175, sales: 78 },
  { hour: '17', visits: 165, sales: 72 },
  { hour: '18', visits: 155, sales: 68 },
  { hour: '19', visits: 145, sales: 62 },
  { hour: '20', visits: 125, sales: 55 },
  { hour: '21', visits: 98, sales: 42 },
  { hour: '22', visits: 75, sales: 28 },
  { hour: '23', visits: 58, sales: 18 },
];

const performanceRadar = [
  { metric: 'Doanh thu', A: 120, B: 110, fullMark: 150 },
  { metric: 'Khách hàng', A: 98, B: 130, fullMark: 150 },
  { metric: 'Đơn hàng', A: 86, B: 130, fullMark: 150 },
  { metric: 'Chuyển đổi', A: 99, B: 100, fullMark: 150 },
  { metric: 'Giá trị TB', A: 85, B: 90, fullMark: 150 },
  { metric: 'Hài lòng', A: 65, B: 85, fullMark: 150 },
];

const topProducts = [
  { name: 'Áo thun basic trắng', sold: 1250, revenue: 375000, growth: 15.2 },
  { name: 'Quần jeans skinny', sold: 980, revenue: 588000, growth: 8.7 },
  { name: 'Váy maxi hoa', sold: 756, revenue: 453600, growth: 22.1 },
  { name: 'Áo khoác bomber', sold: 642, revenue: 513600, growth: -3.2 },
  { name: 'Túi xách mini', sold: 589, revenue: 294500, growth: 18.9 },
];

const regionData = [
  { region: 'Hà Nội', sales: 2850, revenue: 1425000, customers: 1250 },
  { region: 'TP.HCM', sales: 3200, revenue: 1600000, customers: 1450 },
  { region: 'Đà Nẵng', sales: 1200, revenue: 600000, customers: 580 },
  { region: 'Cần Thơ', sales: 890, revenue: 445000, customers: 420 },
  { region: 'Hải Phòng', sales: 750, revenue: 375000, customers: 350 },
];

const conversionFunnel = [
  { name: 'Lượt truy cập', value: 10000, fill: '#8884d8' },
  { name: 'Xem sản phẩm', value: 6500, fill: '#82ca9d' },
  { name: 'Thêm giỏ hàng', value: 2800, fill: '#ffc658' },
  { name: 'Thanh toán', value: 1200, fill: '#ff7300' },
  { name: 'Hoàn thành', value: 950, fill: '#00ff88' },
];

const ClothingSalesDashboard = () => {
  const currentYear = new Date().getFullYear();
  const [filterType, setFilterType] = useState('year'); // hoặc 'monthYear'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonthYear, setSelectedMonthYear] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const queryParams = React.useMemo(() => {
    if (filterType === 'year') {
      return { year: selectedYear };
    } else {
      const [year, month] = selectedMonthYear.split('-');
      return { year: parseInt(year), month };
    }
  }, [filterType, selectedYear, selectedMonthYear]);

  const {
    data: billStatistics,
    isLoading: isLoadingBillStatistics,
    error: errorBillStatistics,
  } = useGetBillStatisticsDashboardQuery(currentYear);

  const {
    data: CategoryStatistics,
    isLoading: isLoadingCategoryStatistics,
    error: errorCategoryStatistics,
  } = useGetRevenueByCategoryQuery({ year: currentYear });

  const {
    data: topSellingProducts,
    isLoading: isLoadingTopSellingProducts,
    error: errorTopSellingProducts,
  } = useTopSellingProductsQuery(
    filterType === 'year'
      ? { year: selectedYear }
      : {
          year: parseInt(selectedMonthYear.split('-')[0], 10),
          month: selectedMonthYear.split('-')[1],
        },
    { enabled: !!(filterType === 'year' ? selectedYear : selectedMonthYear) }, // đảm bảo có giá trị mới gọi
  );

  const { data: getStatCard, isLoading: isLoadingStatCard, error: errorStatCard } = useGetStatCardDashboardQuery();
  const revenueResponse = getStatCard?.data?.revenueResponse || [];
  const getBillStatusCounts = getStatCard?.data?.getBillStatusCounts || [];
  const productInventoryDTOS = getStatCard?.data?.productInventoryDTOS || [];
  const getQuantityByYear = getStatCard?.data?.getQuantityByYear || [];
  const productQuantityDTOS = getStatCard?.data?.productQuantityDTOS || [];
  useEffect(() => {
    if (filterType === 'year') {
      setSelectedYear(new Date().getFullYear());
    } else {
      const now = new Date();
      setSelectedMonthYear(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    }
  }, [filterType]);

  const getTotalRevenue = (data) => {
    return data.reduce((sum, item) => sum + item.revenue, 0);
  };

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#AA336A',
    '#9933FF',
    '#FF6699',
    '#3399FF',
    '#66CC66',
    '#FF6666',
    '#9966CC',
    '#FF9966',
  ];

  const StatCard = ({ title, value, change, icon, color, bgColor }) => (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${bgColor}22 0%, ${bgColor}11 100%)`,
        border: `1px solid ${bgColor}33`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 25px ${bgColor}44`,
        },
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="text.secondary" variant="body2" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div" sx={{ color, fontWeight: 'bold', mb: 1 }}>
              {value}
            </Typography>
            <Chip
              label={change}
              size="small"
              sx={{
                bgcolor: change.includes('+') ? '#4caf5022' : '#f4433622',
                color: change.includes('+') ? '#4caf50' : '#f44336',
                fontWeight: 'bold',
              }}
            />
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  );

  const currentRevenue = revenueResponse.find((r) => r.year === currentYear)?.totalRevenue || 0;
  const prevRevenue = revenueResponse.find((r) => r.year === currentYear - 1)?.totalRevenue;
  const formattedRevenue = `₫${(currentRevenue / 1_000_000).toFixed(1)}M`;
  let change = '+100%';
  if (prevRevenue !== undefined && prevRevenue !== 0) {
    const growth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;
    const sign = growth >= 0 ? '+' : '';
    change = `${sign}${growth.toFixed(1)}%`;
  }

  // Tính toán số lượng sản phẩm hiện tại và trước đó
  const currentQuantity = getQuantityByYear.find((r) => r.year === currentYear)?.totalQuantity || 0;
  const previousQuantity = getQuantityByYear.find((r) => r.year === currentYear - 1)?.totalQuantity;

  const formattedQuantity = currentQuantity.toLocaleString('en-US'); // => "19"

  let quantityChange = '+100%';

  if (previousQuantity !== undefined && previousQuantity > 0) {
    const percentChange = ((currentQuantity - previousQuantity) / previousQuantity) * 100;
    const sign = percentChange >= 0 ? '+' : '';
    quantityChange = `${sign}${percentChange.toFixed(1)}%`;
  } else if (previousQuantity === 0) {
    quantityChange = '+100%';
  }

  //Tồn kho
  let totalQuantity = 0;
  let totalImportPrice = 0;
  let totalSellingPrice = 0;

  for (const p of productInventoryDTOS) {
    totalQuantity += p.quantity;
    totalImportPrice += p.quantity * p.import;
    totalSellingPrice += p.quantity * p.selling;
  }

  // Format value cho hiển thị
  const formattedImportPrice =
    totalImportPrice >= 1_000_000
      ? `₫${(totalImportPrice / 1_000_000).toFixed(1)}M`
      : `₫${(totalImportPrice / 1_000).toFixed(0)}K`;

  const inventoryChange = '+100%';

  const [firstStatus = {}, ...restStatuses] = getBillStatusCounts || [];
  return (
    <Container maxWidth={false} sx={{ width: '100%', height: '100%' }}>
      {/* Thống kê tổng quan nâng cao */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={`Tổng Doanh Thu : ${currentYear}`}
            value={formattedRevenue}
            change={change}
            icon="💰"
            color="#1976d2"
            bgColor="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title={`Số lượng đã mua trong : ${currentYear}`}
            value={formattedQuantity}
            change={quantityChange}
            icon="📦"
            color="#4caf50"
            bgColor="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Tồn Kho"
            value={formattedImportPrice}
            change={totalQuantity.toLocaleString('en-US')}
            icon="📊"
            color="#795548"
            bgColor="#795548"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          {firstStatus.label ? (
            <StatCard
              title={firstStatus.label}
              value={`${firstStatus.total?.toLocaleString('en-US') || 0} đơn hàng`}
              change=""
              icon="⏳"
              color="#3f51b5"
              bgColor="#3f51b5"
            />
          ) : (
            <div>No data available</div>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {restStatuses.map((item, index) => {
          const iconList = ['🚚', '✅', '❌', '💸'];
          const colors = ['#2196f3', '#4caf50', '#f44336', '#9e9e9e'];

          return (
            <Grid item xs={12} sm={6} lg={3} key={item.label}>
              <StatCard
                title={item.label}
                value={`${item.total.toLocaleString('en-US')} đơn hàng`}
                change=""
                icon={iconList[index]}
                color={colors[index]}
                bgColor={colors[index]}
              />
            </Grid>
          );
        })}
      </Grid>

      {/* Biểu đồ chính */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Biểu đồ doanh thu tổng hợp */}
        <Grid item xs={12} lg={7}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              📈 Xu Hướng Doanh Thu & Đơn Hàng
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={billStatistics?.data} margin={{ top: 20, right: 30, left: 60, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis yAxisId="left" stroke="#64748b" tickFormatter={(value) => value.toLocaleString()} />
                <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value, name) => {
                    if (name === 'Doanh thu') {
                      return [`${Number(value).toLocaleString()} VNĐ`, name];
                    } else if (name === 'Đơn hàng') {
                      return [value, name];
                    } else if (name === 'Khách hàng') {
                      return [value, name];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8884d8"
                  fill="url(#colorRevenue)"
                  name="Doanh thu"
                />
                <Bar yAxisId="right" dataKey="totalOrders" fill="#82ca9d" name="Đơn hàng" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="totalCustomers"
                  stroke="#ff7300"
                  strokeWidth={3}
                  name="Khách hàng"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Biểu đồ phân loại sản phẩm nâng cao */}
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              🎯 Phân Bố Danh Mục
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={CategoryStatistics?.data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="revenue"
                  nameKey="categoryName"
                >
                  {CategoryStatistics?.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${((value / getTotalRevenue(CategoryStatistics?.data)) * 100).toFixed(
                      2,
                    )}% (${value.toLocaleString()} VNĐ)`,
                    name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Hàng biểu đồ mới */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              🗺️ Doanh Số Theo Khu Vực
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={regionData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis dataKey="region" type="category" stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value, name) => [
                    name === 'sales' ? `${value} đơn` : `₫${value.toLocaleString()}`,
                    name === 'sales' ? 'Đơn hàng' : 'Doanh thu',
                  ]}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid> */}
        {/* <Grid item xs={12} md={12}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              👕 Phân Tích Theo Size
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesBySize}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="size" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a202c',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value, name) => [
                    name === 'sales' ? `${value} sản phẩm` : `₫${value.toLocaleString()}`,
                    name === 'sales' ? 'Số lượng' : 'Doanh thu',
                  ]}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid> */}
      </Grid>

      {/* Hàng cuối - Thống kê khu vực và size */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              🏆 Top Sản Phẩm Bán Chạy
            </Typography>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap">
              <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ mr: 2 }}>
                <FormControlLabel value="year" control={<Radio />} label="Theo năm" />
                <FormControlLabel value="monthYear" control={<Radio />} label="Theo tháng/năm" />
              </RadioGroup>

              {filterType === 'year' ? (
                <TextField
                  type="number"
                  label="Năm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  size="small"
                  sx={{ width: 120 }}
                />
              ) : (
                <TextField
                  type="month"
                  label="Tháng/Năm"
                  value={selectedMonthYear}
                  onChange={(e) => setSelectedMonthYear(e.target.value)}
                  size="small"
                  sx={{ width: 240 }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Đã bán
                    </TableCell>
                    {/* <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Doanh thu
                    </TableCell> */}
                    {/* <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Tăng trưởng
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topSellingProducts?.data.map((product, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: '#3b82f6' }}>{index + 1}</Avatar>
                          {product.productName}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{product.totalQuantitySold.toLocaleString()}</TableCell>
                      {/* <TableCell align="right">₫{product.revenue.toLocaleString()}</TableCell> */}
                      {/* <TableCell align="right">
                        <Chip
                          label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                          size="small"
                          sx={{
                            bgcolor: product.growth > 0 ? '#dcfce7' : '#fee2e2',
                            color: product.growth > 0 ? '#16a34a' : '#dc2626',
                          }}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
              🚚 Sản Phẩm Gần Hết Hàng
            </Typography>
            {/* <Box display="flex" alignItems="center" justifyContent="space-between" mb={2} flexWrap="wrap">
              <RadioGroup row value={filterType} onChange={(e) => setFilterType(e.target.value)} sx={{ mr: 2 }}>
                <FormControlLabel value="year" control={<Radio />} label="Theo năm" />
                <FormControlLabel value="monthYear" control={<Radio />} label="Theo tháng/năm" />
              </RadioGroup>

              {filterType === 'year' ? (
                <TextField
                  type="number"
                  label="Năm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                  size="small"
                  sx={{ width: 120 }}
                />
              ) : (
                <TextField
                  type="month"
                  label="Tháng/Năm"
                  value={selectedMonthYear}
                  onChange={(e) => setSelectedMonthYear(e.target.value)}
                  size="small"
                  sx={{ width: 240 }}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            </Box> */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Sản phẩm</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Số lượng còn lại
                    </TableCell>
                    {/* <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Doanh thu
                    </TableCell> */}
                    {/* <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                      Tăng trưởng
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productQuantityDTOS.map((product, index) => (
                    <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: '#3b82f6' }}>{index + 1}</Avatar>
                          {product.name}
                        </Box>
                      </TableCell>
                      <TableCell align="right">{product.totalQuantity.toLocaleString()}</TableCell>
                      {/* <TableCell align="right">₫{product.revenue.toLocaleString()}</TableCell> */}
                      {/* <TableCell align="right">
                        <Chip
                          label={`${product.growth > 0 ? '+' : ''}${product.growth}%`}
                          size="small"
                          sx={{
                            bgcolor: product.growth > 0 ? '#dcfce7' : '#fee2e2',
                            color: product.growth > 0 ? '#16a34a' : '#dc2626',
                          }}
                        />
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClothingSalesDashboard;
