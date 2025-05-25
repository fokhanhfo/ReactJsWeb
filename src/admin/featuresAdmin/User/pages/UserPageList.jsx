import React from 'react';
import PropTypes from 'prop-types';
import Loading from 'components/Loading';
import ListUser from '../components/ListUser';

UserPageList.propTypes = {
  users: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

function UserPageList({ users, loading = false }) {
  return (
    <>
      <div className="title">
        <h3>Users</h3>
      </div>
      {/* <div>
                <StyledButton variant="contained"><Link to="./add">Add Product</Link></StyledButton>
            </div> */}
      {!loading ? <ListUser users={users} /> : <Loading />}
    </>
  );
}

export default UserPageList;
