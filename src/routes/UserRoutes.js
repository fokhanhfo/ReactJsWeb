import Navbar from 'components/Header/header';
import AlbumFeature from 'features/Ablum/Pages';
import CartFeature from 'features/Cart';
import CheckOutFeatures from 'features/Checkout';
import NewArrivalsFeatures from 'features/NewArrivals';
import ProductFeatureCopy from 'features/Product';
import TodoFeature from 'features/Todo/Pages';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import NotFound from 'components/NotFound';
import HomeFeatures from 'features/Home';
import CounterFeature from 'features/Counter';
import Bill from 'features/Bill';
import Footer from 'components/Footer/Footer';
import UserDetail from 'features/Bill';
import HoangHaiFashionMUI from 'features/AboutUs';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import BlogPage from 'features/Blog';

function UserRoutes() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      <Navbar/>
      {!isMobile ? (
        <Box pt={'162.6px'}></Box>
      ): (
        <Box pt={'60px'}></Box>
      )}
      <Routes>
        <Route path="/counttest" element={<CounterFeature/>} />
        <Route path="/" element={<HomeFeatures/>} />
        <Route path="/todos/*" element={<TodoFeature />} />
        <Route path="/contact" element={<AlbumFeature />} />
        <Route path="/ABOUT-US" element={<HoangHaiFashionMUI />} />
        <Route path="/Blog" element={<BlogPage />} />
        <Route path="/products/*" element={<ProductFeatureCopy />} />
        

        <Route element={<PrivateRoute/>} >
          {/* <Route path="/cart/*" element={<CartFeature />} /> */}
          <Route path="/checkout/*" element={<CheckOutFeatures />} />
          <Route path="/newproduct/" element={<NewArrivalsFeatures />} />
          <Route path="/user/*" element={<UserDetail />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default UserRoutes;
