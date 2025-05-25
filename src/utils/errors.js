export const handleGlobalError = (error, enqueueSnackbar) => {
      enqueueSnackbar(error, { variant: 'error' });
  };
  