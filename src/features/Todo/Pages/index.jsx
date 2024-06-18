import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TodoList from '../Components/Todolist';
import { Route, Routes } from 'react-router-dom';
import ListPage from './ListPage';
import DetailPage from './DetailPage';
import NotFound from '../../../components/NotFound';

TodoFeature.propTypes = {};
function TodoFeature(props) {
  return (
    <div>
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path=":todoId" element={<DetailPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default TodoFeature;
