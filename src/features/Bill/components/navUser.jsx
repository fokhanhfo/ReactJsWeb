import React from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import SendIcon from '@mui/icons-material/Send';

NavUser.propTypes = {};

function NavUser(props) {
  const userQuery = useSelector((state) => state.user.current.sub);

  const [open, setOpen] = React.useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar />
        <Box ml={2}>
          <Typography>{userQuery}</Typography>
          <Button>
            <NavLink to="/edit-profile">Sửa Hồ Sơ</NavLink>
          </Button>
        </Box>
      </Box>
      <List sx={{ width: '100%', bgcolor: 'background.paper' }} component="nav">
        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <SendIcon />
          </ListItemIcon>
          <ListItemText primary="Sent mail" />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton sx={{ pl: 4 }}>
              <ListItemIcon>
                <SendIcon />
              </ListItemIcon>
              <ListItemText primary="Starred" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>
    </Box>
  );
}

export default NavUser;
