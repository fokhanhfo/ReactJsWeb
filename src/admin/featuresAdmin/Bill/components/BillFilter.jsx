import React from 'react';
import PropTypes from 'prop-types';
import StatusBill from './filter/StatusBill';
import DateBill from './filter/DateBill';

BillFilter.propTypes = {
    filter : PropTypes.object.isRequired,
    onSubmit : PropTypes.func.isRequired,
};

function BillFilter({filter,onSubmit}) {

    const handleChangeStatus = (status)=>{
        const newFilter = {
            ...filter,
            status : status,
        }
        if(onSubmit){
            onSubmit(newFilter);
        }
    }

    const handleDate = (value)=>{
        const newFilter = {
            ...filter,
            start_date : value.startDate,
            end_date : value.endDate
        }
        if(onSubmit){
            onSubmit(newFilter);
        }
    }
    return (
        <>
            <div className='bill_filter_status'> 
                <StatusBill filter={filter} onSubmit={handleChangeStatus}></StatusBill>
                <DateBill filter={filter} onSubmit={handleDate}/>
            </div>
        </>
    );
}

export default BillFilter;