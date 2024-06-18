import Header from 'components/Header';
import ProductFeature from 'features/Product/pages';
import { useSnackbar } from 'notistack';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import NotFound from './components/NotFound';
import AlbumFeature from './features/Ablum/Pages';
import CounterFeature from './features/Counter';
import TodoFeature from './features/Todo/Pages';

function App() {
  const {enqueueSnackbar} = useSnackbar();
  return (
    <div className="App">
      <Header/>
      <Routes>
        <Route path="/home" element={<Navigate to="/" />} />
        <Route path="/todos/*" element={<TodoFeature />} />
        <Route path="/albums" element={<AlbumFeature />} />
        <Route path='/redux' element={<CounterFeature/>} />
        <Route path='/products/*' element={<ProductFeature/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
