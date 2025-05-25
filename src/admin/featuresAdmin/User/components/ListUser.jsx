import React from 'react';
import PropTypes from 'prop-types';
import ReusableTable from 'admin/components/Table/ReusableTable';

ListUser.propTypes = {
  users: PropTypes.array.isRequired,
};

function ListUser({ users }) {
  console.log(users);
  const listHead = [
    { label: 'id', key: 'id', width: '10%' },
    { label: 'UserName', key: 'username', width: '30%' },
    { label: 'Email', key: 'email', width: '40%' },
    {
      label: 'Role',
      key: 'role',
      width: '40%',
      render: (row) => {
        const roels = row.roles.map((role) => role.name).join(', ');
        return <>{roels}</>;
      },
    },
    {
      label: 'Thao tác',
      key: 'actions',
      width: '20%',
      render: (row) => (
        <>
          {/* <IconButton>
            <DeleteIcon />
          </IconButton>
          <IconButton>
            <Link to={`./${row.id}`}>
              <Update />
            </Link>
          </IconButton> */}
        </>
      ),
    },
  ];
  return <ReusableTable listHead={listHead} rows={users} />;
}

export default ListUser;
