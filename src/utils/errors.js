export const handleGlobalError = (error, enqueueSnackbar) => {
      enqueueSnackbar(error.response.data.error, { variant: 'error' });
  };
  