import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Container, Dialog, DialogContent, IconButton } from '@mui/material';
import { loginWindow } from 'features/Auth/userSlice';
import { Close } from '@mui/icons-material';
import styled from 'styled-components';
import Register from 'features/Auth/Components/Register';
import Login from 'features/Auth/Components/Login';

AuthDialog.propTypes = {};

const MODE = {
  LOGIN: 'login',
  REGISTER: 'register',
};

function AuthDialog(props) {
  const isLoginWindow = useSelector((state) => state.user.settings.isLoginWindow);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(loginWindow());
  };
  const [mode, setMode] = React.useState(MODE.LOGIN);

  return (
    <React.Fragment>
      <Dialog
        open={isLoginWindow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableEscapeKeyDown
      >
        <Box>
          <IconButton onClick={handleClose} sx={{ float: 'right' }}>
            <Close />
          </IconButton>
        </Box>
        <Container>
          <DialogContent sx={{ padding: '0' }}>
            {mode === MODE.REGISTER && (
              <>
                <Register closeDialog={handleClose}></Register>
                <Box>
                  <Button
                    sx={{ float: 'right', margin: '10px 0' }}
                    onClick={() => {
                      setMode(MODE.LOGIN);
                    }}
                  >
                    Login
                  </Button>
                </Box>
              </>
            )}

            {mode === MODE.LOGIN && (
              <>
                <Login closeDialog={handleClose}></Login>
                <Box>
                  <Button
                    onClick={() => {
                      setMode(MODE.REGISTER);
                    }}
                    sx={{ float: 'right', margin: '10px 0' }}
                  >
                    Register
                  </Button>
                </Box>
              </>
            )}
          </DialogContent>
        </Container>
      </Dialog>
    </React.Fragment>
  );
}

export default AuthDialog;
