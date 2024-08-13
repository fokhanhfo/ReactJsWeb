import { Box, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';
ProductSort.propTypes = {
    currentSort: PropTypes.string.isRequired,
    onChange: PropTypes.func,
};

function ProductSort(props) {
    const { currentSort, onChange } = props;
    const handleSortChange = (event) =>{
        const newValue = event.target.value;
        if(onChange) onChange(newValue);
    }

    return (
        <div>
            <Box>
                <Select
                    style={{float: 'right',}}
                    value={currentSort}
                    onChange={handleSortChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                    <MenuItem value="">
                        <em>Sắp xếp</em>
                    </MenuItem>
                    <MenuItem value='Price:ASC'>Tăng dần</MenuItem>
                    <MenuItem value='Price:DESC'>Giảm dần</MenuItem>
                </Select>
            </Box>
        </div>
    );
}

export default ProductSort;