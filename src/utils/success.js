export const handleGlobalSuccess = (res, enqueueSnackbar) => {
    console.log(res)
    enqueueSnackbar(res.message, { variant: 'success' })
};
  