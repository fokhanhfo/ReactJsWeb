import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { Link, NavLink } from 'react-router-dom';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

NavMenu.propTypes = {
  isMenu: PropTypes.bool.isRequired,
};

function NavMenu({ isMenu }) {
  const [openMenus, setOpenMenus] = useState({
    product: false,
    category: false,
    bill: false,
    permission_and_user: false,
  });

  const handleClick = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  return (
    <>
      <div style={{ height: '100vh' }}>
        <div className="header_home_img">
          <Link style={{ textDecoration: 'none' }} to="./home">
            {isMenu ? 'ADMIN' : <InboxIcon />}
          </Link>
        </div>

        <div className="nav_menu_content">
          <div className="menu_management product">
            <List>
              <ListItemButton onClick={() => handleClick('product')}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                {isMenu && <ListItemText primary="Sản phẩm" />}
                {isMenu && (openMenus.product ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openMenus.product && isMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink to="../products" className={'item_menu_mangament'}>
                    <ListItemButton sx={{ pl: 4 }}>
                      {isMenu && openMenus.product && <ListItemText primary="Danh sách sản phẩm" />}
                    </ListItemButton>
                  </NavLink>
                </List>
              </Collapse>
            </List>
          </div>

          <div className="menu_management category">
            <List>
              <ListItemButton onClick={() => handleClick('category')}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                {isMenu && <ListItemText primary="Danh mục" />}
                {isMenu && (openMenus.category ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openMenus.category && isMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink to="../category" className={'item_menu_mangament'}>
                    <ListItemButton sx={{ pl: 4 }}>
                      {isMenu && openMenus.category && <ListItemText primary="Danh sách danh mục" />}
                    </ListItemButton>
                  </NavLink>
                </List>
              </Collapse>
            </List>
          </div>

          <div className="menu_management bill">
            <List>
              <ListItemButton onClick={() => handleClick('bill')}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                {isMenu && <ListItemText primary="Hóa đơn" />}
                {isMenu && (openMenus.bill ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openMenus.bill && isMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink
                    to="../bill"
                    className={({ isActive }) =>
                      isActive ? 'item_menu_mangament active-link' : 'item_menu_mangament link'
                    }
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      {isMenu && openMenus.bill && <ListItemText primary="Danh sách hóa đơn" />}
                    </ListItemButton>
                  </NavLink>
                </List>
              </Collapse>
            </List>
          </div>
          <div className="menu_management permission_and_user">
            <List>
              <ListItemButton onClick={() => handleClick('permission_and_user')}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                {isMenu && <ListItemText primary="Permission and User" />}
                {isMenu && (openMenus.permission_and_user ? <ExpandLess /> : <ExpandMore />)}
              </ListItemButton>
              <Collapse in={openMenus.permission_and_user && isMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <NavLink
                    to="../user"
                    className={({ isActive }) =>
                      isActive ? 'item_menu_mangament active-link' : 'item_menu_mangament link'
                    }
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      {isMenu && openMenus.permission_and_user && <ListItemText primary="User" />}
                    </ListItemButton>
                  </NavLink>
                  <NavLink
                    to="../permission"
                    className={({ isActive }) =>
                      isActive ? 'item_menu_mangament active-link' : 'item_menu_mangament link'
                    }
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      {isMenu && openMenus.permission_and_user && <ListItemText primary="Permission" />}
                    </ListItemButton>
                  </NavLink>
                </List>
              </Collapse>
            </List>
          </div>
        </div>
      </div>
    </>
  );
}

export default NavMenu;
