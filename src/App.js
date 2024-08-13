import { useSnackbar } from 'notistack';
import './App.css';
import { useGetCartQuery } from 'features/Cart/cartApi';
import Loading from 'components/Loading';
import { useGetCategoryQuery } from 'api/categoryApi';
import UserRoutes from 'routes/UserRoutes';
import AdminRoutes from 'routes/AdminRoutes';
import NotFound from 'components/NotFound';
import { Navigate, Route, Routes } from 'react-router-dom';
import PrivateRoute from 'routes/PrivateRoute';
import Navbar from 'components/Header/header';

function App() {
  const {enqueueSnackbar} = useSnackbar();
  const { data: dataCart, error: errorCart, isLoading: isLoadingCart } = useGetCartQuery();
  const {data: dataCategory, error: errorCategory, isLoading: isLoadingCategory}= useGetCategoryQuery();
  if (isLoadingCart) {
    return <Loading></Loading>;
  }
  
  if(isLoadingCategory){
    return <Loading></Loading>;
  }

  if (errorCart) {
    return <div>Error: {errorCart.message}</div>;
  }

  if(errorCategory){
    return <div>Error: {errorCategory.message}</div>
  }

  return (
    <>
      <div className="App">
        {/* <Routes>
          <Route path="/home" element={<Navigate to="/" />} />
          <Route path="/todos/*" element={<TodoFeature />} />
          <Route path="/albums" element={<AlbumFeature />} />
          <Route path='/redux' element={<CounterFeature/>} />
          <Route path='/products/*' element={<ProductFeature/>} />
          <Route path='/cart/*' element={<CartFeature/>} />
          <Route path="*" element={<NotFound />} />
          <Route path='/checkout/*' element={<CheckOutFeatures/>} />
          <Route path='/newproduct/' element={<NewArrivalsFeatures/>} />
        </Routes> */}
          {/* <div className='user'>
            <UserRoutes/>
          </div> */}
          {/* <div>
            <AdminRoutes/>
          </div> */}
          {/* <div> */}
            {/* <Routes>
              <Route path="*" element={<NotFound />} />
            </Routes> */}
          {/* </div> */}
          <Routes>
            <Route path="/home" element={<Navigate to="/" />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            
            <Route path="/login" element={<Navigate to="/" />}/>
        
            <Route path="/*" element={<UserRoutes />} />
          </Routes>
      </div>
    </>
  );
}

export default App;
