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

function UserRoutes() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/todos/*" element={<TodoFeature />} />
        <Route path="/albums" element={<AlbumFeature />} />

        <Route element={<PrivateRoute/>} >
          <Route path="/products/*" element={<ProductFeatureCopy />} />
          <Route path="/cart/*" element={<CartFeature />} />
          <Route path="/checkout/*" element={<CheckOutFeatures />} />
          <Route path="/newproduct/" element={<NewArrivalsFeatures />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default UserRoutes;
