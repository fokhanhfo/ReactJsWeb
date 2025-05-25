export const handleGlobalSuccess = (res, enqueueSnackbar) => {
    enqueueSnackbar(res.message, { variant: 'success' })
};
  