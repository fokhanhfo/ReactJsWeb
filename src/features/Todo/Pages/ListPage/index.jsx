import React, { useEffect, useState } from 'react';
import TodoList from '../../Components/Todolist';
import { useLocation, useMatch, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import TodoForm from '../../Components/TodoForm';


function ListPage(props) {
    const initTodoList = [
        {
            id: 1,
            title: "list 1",
            status: "new"
        },
        {
            id: 2,
            title: "list 2",
            status: "completed"
        },
        {
            id: 3,
            title: "list 3",
            status: "new"
        },
    ]

    const location = useLocation();
    const navigate = useNavigate();
    const [todoList, setTodoList] = useState(initTodoList);
    const [filterStatuses, setFilterStatuses] = useState(() => {
        const params = queryString.parse(location.search);
        return params.status || 'all';
    });

    useEffect(() => {
        const params = queryString.parse(location.search);
        setFilterStatuses(params.status || 'all');

    }, [location.search])

    const handleTodoClick = (todo, idx) => {
        const newTodoList = [...todoList]
        newTodoList[idx] = {
            ...newTodoList[idx],
            status: newTodoList[idx].status === 'new' ? 'completed' : 'new',
        };
        console.log(todo, idx);
        setTodoList(newTodoList);
    }

    const handleShowAllClick = () => {
        // setFilterStatuses('all');
        const queryParams = { status: 'all' };
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(queryParams),
        })
    };

    const handleShowCompletedClick = () => {
        // setFilterStatuses('completed');
        const queryParams = { status: 'completed' };
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(queryParams),
        })
    };

    const handleShowNewClick = () => {
        // setFilterStatuses('new');
        const queryParams = { status: 'new' };
        navigate({
            pathname: location.pathname,
            search: queryString.stringify(queryParams),
        })
    };

    const renderdTodoList = todoList.filter(todo => filterStatuses === 'all' || filterStatuses === todo.status);

    const handleTodoFormSubmit = (value) => {
        console.log("form",value);
        const newTodo = {
            id: todoList.length + 1,
            title: value.title,
            status: 'new',
        }
        const newTodoList = [...todoList, newTodo];
        setTodoList(newTodoList);
    };

    return (
        <div>

            <h3>Todo Form</h3>
            <TodoForm onSubmit={handleTodoFormSubmit}></TodoForm>
            
            <h3>Todo list</h3>
            <TodoList todoList={renderdTodoList} onTodoClick={handleTodoClick}></TodoList>

            <div>
                <button onClick={handleShowAllClick}>Show all</button>
                <button onClick={handleShowCompletedClick}>Show Completed</button>
                <button onClick={handleShowNewClick}>Show New</button>
            </div>
        </div>
    );
}

export default ListPage;