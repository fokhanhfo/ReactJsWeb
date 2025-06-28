import { useSnackbar } from 'notistack';
import './App.css';
import { useGetCartQuery } from 'features/Cart/cartApi';
import Loading from 'components/Loading';
import { useGetCategoryQuery } from 'api/categoryApi';
import UserRoutes from 'routes/UserRoutes';
import AdminRoutes from 'routes/AdminRoutes';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material';
import LogoutListener from 'components/LogoutListener';
import { BreadcrumbProvider } from 'admin/components/Breadcrumbs/BreadcrumbContext';
import HoangHaiFashion from 'features/AboutUs';
// const theme = responsiveFontSizes(
//   createTheme({
//     palette: {
//       primary: {
//         main: '#1976d2',
//         success: 'rgba(113,221,55,0.16)',
//       },
//       success: {
//         main: '#2e7d32',
//       },
//     },
//     typography: {
//       fontSize: 12, // base = 12px (~0.75rem)
//       '@media (max-width:600px)': {
//         fontSize: 10, // 👈 khi màn hình <600px, giảm xuống
//       },
//       '@media (max-width:400px)': {
//         fontSize: 9,
//       },
//       body1: {
//         fontSize: '0.85rem',
//         '@media (max-width:600px)': {
//           fontSize: '0.75rem', // 👈 nhỏ hơn khi màn hình <600px
//         },
//         '@media (max-width:400px)': {
//           fontSize: '0.7rem', // 👈 siêu nhỏ cho điện thoại bé
//         },
//       },
//       h1: {
//         fontSize: '2rem',
//         '@media (max-width:600px)': {
//           fontSize: '1.5rem',
//         },
//       },
//       h2: {
//         fontSize: '1.5rem',
//         '@media (max-width:600px)': {
//           fontSize: '1.2rem',
//         },
//       },
//     },
//   })
// );
let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      success: 'rgba(113,221,55,0.16)',
    },
    success: {
      main: '#2e7d32',
    },
  },
  typography: {
    fontSize: 14, // base font size
    h5: {
      fontSize: '1.5rem',
      [`@media (max-width:600px)`]: {
        fontSize: '1.2rem',
      },
      [`@media (max-width:400px)`]: {
        fontSize: '1rem',
      },
    },
    body1: {
      fontSize: '1rem',
      [`@media (max-width:600px)`]: {
        fontSize: '0.875rem',
      },
      [`@media (max-width:400px)`]: {
        fontSize: '0.75rem',
      },
    },
  },
});

theme = responsiveFontSizes(theme);





function App() {
  const {enqueueSnackbar} = useSnackbar();
  const currentUser = useSelector((state) => state.user.current);
  const isCurrentUserEmpty = Object.keys(currentUser).length === 0;
  const {
    data: dataCart,
    error: errorCart,
    isLoading: isLoadingCart,
    refetch: refetchCart
  } = useGetCartQuery(undefined, {
    skip: isCurrentUserEmpty,
  });

  const {
    data: dataCategory,
    error: errorCategory,
    isLoading: isLoadingCategory
  } = useGetCategoryQuery();

  const dispatch = useDispatch();



  if (isLoadingCart) {
    return <Loading></Loading>;
  }
  
  if(isLoadingCategory){
    return <Loading></Loading>;
  }

  if (errorCart) {
    console.log(errorCart);
    return <div>Error cart: {errorCart.message}</div>;
  }

  if(errorCategory){
    return <div>Error: {errorCategory.message}</div>
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
          <LogoutListener/>
          <Routes>
            <Route path="/home" element={<Navigate to="/" />} />            <Route path="/admin/*" element={
                <BreadcrumbProvider>
                    <AdminRoutes />
                </BreadcrumbProvider>
              } 
            />
            
            <Route path="/login" element={<Navigate to="/" />}/>
        
            <Route path="/*" element={<UserRoutes />} />
          </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

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
