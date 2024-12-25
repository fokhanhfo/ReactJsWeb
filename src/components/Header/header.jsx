import React, { useState, useEffect } from "react";
import './styles.scss';
import { useDispatch, useSelector } from "react-redux";
import NavMobile from "./components/NavMobile";
import NavWeb from "./components/NavWeb";
import AuthDialog from "./components/AuthDialog";
import Search from "./components/Search";



const Navbar = () => {
  const categoryQuery = useSelector((state)=> state.categoryApi.queries["getCategory(undefined)"]);
  const listCategory = categoryQuery.data.data;
  const dispatch = useDispatch();

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return ( 
    <div className="header">
        <Search/>
        <div className="nav-container">
            {isMobile ? (
                <NavMobile toggleMenu={toggleMenu} isMenuOpen={isMenuOpen} listCategory={listCategory}/>
            ) : (
                <NavWeb listCategory={listCategory}/>
            )}
        </div>
        <AuthDialog/>
    </div>
  );
};

export default Navbar;
