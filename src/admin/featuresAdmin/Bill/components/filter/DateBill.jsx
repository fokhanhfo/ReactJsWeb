import * as React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, IconButton, TextField } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import customParseFormat from 'dayjs/plugin/customParseFormat';

DateBill.propTypes = {
  filter: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

function DateBill({ filter, onSubmit }) {
  dayjs.extend(customParseFormat);
  const [startDate, setStartDate] = React.useState(
    filter.start_date ? dayjs(filter.start_date, 'DD-MM-YYYY') : dayjs().subtract(1, 'month'),
  );
  const [endDate, setEndDate] = React.useState(filter.end_date ? dayjs(filter.end_date, 'DD-MM-YYYY') : dayjs());
  console.log(startDate);
  console.log(endDate);

  const handleStartDateChange = (newStartDate) => {
    if (newStartDate && newStartDate.isAfter(endDate)) {
      setEndDate(newStartDate);
    }
    setStartDate(newStartDate);
  };

  const handleEndDateChange = (newEndDate) => {
    if (newEndDate && newEndDate.isBefore(startDate)) {
      setStartDate(newEndDate);
    }
    setEndDate(newEndDate);
  };

  const handleDateChange = () => {
    if (onSubmit) {
      const startDateDetails = startDate
        ? dayjs(startDate, 'DD-MM-YYYY').startOf('day').format('DD-MM-YYYY HH:mm:ss')
        : null;
      const endDateDetails = endDate ? dayjs(endDate, 'DD-MM-YYYY').endOf('day').format('DD-MM-YYYY HH:mm:ss') : null;

      onSubmit({ startDate: startDateDetails, endDate: endDateDetails });
    }
  };

  const handleDateChangeMonth = (months) => {
    if (onSubmit) {
      const startDate = dayjs().subtract(months, 'month');
      const endDate = dayjs();

      // Đảm bảo ngày bắt đầu và kết thúc là đúng với thời gian trong ngày
      const startDateDetails = startDate.startOf('day').format('DD-MM-YYYY HH:mm:ss');
      const endDateDetails = endDate.endOf('day').format('DD-MM-YYYY HH:mm:ss');

      onSubmit({ startDate: startDateDetails, endDate: endDateDetails });
    }
  };

  return (
    <Box>
      <Box display="flex" gap={2}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" gap={2}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              format="DD-MM-YYYY"
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              format="DD-MM-YYYY"
              renderInput={(params) => <TextField {...params} />}
            />
          </Box>
        </LocalizationProvider>
        <Button onClick={handleDateChange} variant="outlined" startIcon={<SearchIcon />}>
          Search
        </Button>
      </Box>
      <Box display="flex" margin="10px 0" gap="10px">
        <Button onClick={() => handleDateChangeMonth(1)} variant="outlined">
          1 Tháng
        </Button>
        <Button onClick={() => handleDateChangeMonth(3)} variant="outlined">
          3 Tháng
        </Button>
        <Button onClick={() => handleDateChangeMonth(6)} variant="outlined">
          6 Tháng
        </Button>
      </Box>
    </Box>
  );
}

export default DateBill;
