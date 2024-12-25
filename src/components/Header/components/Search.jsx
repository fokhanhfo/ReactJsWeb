import React from 'react';
import PropTypes from 'prop-types';
import { InputAdornment, TextField } from '@mui/material';
import styled from 'styled-components';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';

Search.propTypes = {
    
};

const StyledTextField = styled(TextField)`
    margin-right:20px;
    width:100%;
    display: flex;
    align-items: center;
    background-color:white;
    border-radius:10px;
    div{
        height:100%;
        width:100%;
        div{
            width:10%
        }
    }
    input{
        padding:0px;
    }
`

function Search(props) {
    const navigate = useNavigate();

    const handleSearch = (event) => {
        event.preventDefault();
        const searchQuery = event.target.searchInput.value; // Lấy giá trị input
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      };

    return (
        <div className="nav-noti">
            <p>Free shipping, 30-day return or refund guarantee.</p>
            <form style={{width:'30%',marginRight:'20px'}} onSubmit={handleSearch}>
                <StyledTextField name='searchInput'
                    InputProps={{
                        startAdornment:(
                            <InputAdornment position="start">
                                <SearchIcon/>
                            </InputAdornment>
                        ),
                    }}
                />
            </form>
        </div>
    );
}

export default Search;