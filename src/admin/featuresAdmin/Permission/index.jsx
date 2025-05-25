import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import useListPermission from './hook/permissionFetch';
import { useDispatch, useSelector } from 'react-redux';
import { resetState } from 'admin/reduxAdmin/slices/actionsSlice';
import ListPermission from './components/ListPermission';
import Loading from 'components/Loading';
import AddPermission from './components/AddPermission';

PermissionAdmin.propTypes = {};

function PermissionAdmin(props) {
  const { permissions, loading, refetch } = useListPermission();
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);
  const actionsState = useSelector((state) => state.actions);
  const onSubmit = (status) => {
    if (status) {
      refetch();
    }
  };
  return (
    <>
      {!loading ? <ListPermission permissions={permissions} actionsState={actionsState} /> : <Loading />}
      <AddPermission actionsState={actionsState} onSubmit={onSubmit} />
    </>
  );
}

export default PermissionAdmin;
