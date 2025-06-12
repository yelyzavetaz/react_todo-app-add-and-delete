/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorComponent } from './components/ErrorComponent/ErrorComponent';
import { Footer } from './components/Footer/Footer';
import { FilterStatusType } from './types/FilterStatusType';
import cn from 'classnames';
import { FormComponent } from './components/FormComponent/FormComponent';
import { ErrorMessage } from './types/ErrorStatusType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState(FilterStatusType.All);
  const [isCompletedTodosExist, setIsCompletedTodosExist] = useState(true);
  const [numberOfNotCompletedTodos, setNumberOfNotCompletedTodos] = useState(0);
  const [visibleTodos, setVisibleTodos] = useState<Todo[]>([]);
  const [needToRefresh, setNeedToRefresh] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isTempTodoLoading, setIsTempTodoLoading] = useState(false);
  const [todoIdsToDelete, setTodoIdsToDelete] = useState<number[]>([]);
  const [isFocusTitleInput, setIsFocusTitleInput] = useState(false);

  useEffect(() => {
    if (showError) {
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }, [showError]);

  useEffect(() => {
    if (todos.some(todo => todo.completed)) {
      setIsCompletedTodosExist(true);
    } else {
      setIsCompletedTodosExist(false);
    }

    let counter = 0;

    for (const todo of todos) {
      if (!todo.completed) {
        counter++;
      }
    }

    setNumberOfNotCompletedTodos(counter);
  }, [todos]);

  useEffect(() => {
    switch (filterStatus) {
      case FilterStatusType.Active:
        setVisibleTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterStatusType.Completed:
        setVisibleTodos(todos.filter(todo => todo.completed));
        break;
      default:
        setVisibleTodos(todos);
    }
  }, [filterStatus, todos]);

  useEffect(() => {
    if (needToRefresh) {
      getTodos()
        .then(todosFromServer => {
          setTodos(todosFromServer);
          setShowError(false);
          setErrorMessage('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.LoadTodos);
          setShowError(true);
        });
      setNeedToRefresh(false);
    }
  }, [needToRefresh]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <FormComponent
            todos={todos}
            setTodos={setTodos}
            setShowError={setShowError}
            setErrorMessage={setErrorMessage}
            setTempTodo={setTempTodo}
            isTempTodoLoading={isTempTodoLoading}
            setIsTempTodoLoading={setIsTempTodoLoading}
            isFocusTitleInput={isFocusTitleInput}
            setIsFocusTitleInput={setIsFocusTitleInput}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isTempTodoLoading={isTempTodoLoading}
          setTodos={setTodos}
          setShowError={setShowError}
          setErrorMessage={setErrorMessage}
          todoIdsToDelete={todoIdsToDelete}
          setIsFocusTitleInput={setIsFocusTitleInput}
        />
        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
            isCompletedTodosExist={isCompletedTodosExist}
            numberOfNotCompletedTodos={numberOfNotCompletedTodos}
            setTodoIdsToDelete={setTodoIdsToDelete}
            setShowError={setShowError}
            setErrorMessage={setErrorMessage}
            setIsFocusTitleInput={setIsFocusTitleInput}
          />
        )}
      </div>

      <ErrorComponent errorMessage={errorMessage} showError={showError} />
    </div>
  );
};
