import { logout } from "features/Auth/userSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";


const LogoutListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = () => {
      dispatch(logout());
    };

    window.addEventListener('logout', handleLogout);

    return () => {
      window.removeEventListener('logout', handleLogout);
    };
  }, [dispatch]);

  return null;
};

export default LogoutListener;
