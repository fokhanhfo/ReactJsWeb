import React from 'react';
import PropTypes from 'prop-types';
import ListPermission from '../components/ListRolePermission';
import Loading from 'components/Loading';

PermissionPageList.propTypes = {
  permissions: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  roles: PropTypes.array.isRequired,
};

function PermissionPageList({ permissions, loading = false, roles }) {
  return (
    <>
      <div className="title">
        <h3>Permissions</h3>
      </div>
      {/* <div>
                <StyledButton variant="contained"><Link to="./add">Add Product</Link></StyledButton>
            </div> */}
      {!loading ? <ListPermission roles={roles} permissions={permissions} /> : <Loading />}
    </>
  );
}

export default PermissionPageList;
