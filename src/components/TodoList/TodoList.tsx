import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { ErrorMessage } from '../../types/ErrorStatusType';

type TodoListProps = {
  todos: Todo[];
  tempTodo: Todo | null;
  isTempTodoLoading: boolean;
  setTodos: (todos: Todo[]) => void;
  setShowError: (value: boolean) => void;
  setErrorMessage: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete: number[];
  setIsFocusTitleInput: (value: boolean) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  isTempTodoLoading,
  setTodos,
  setShowError,
  setErrorMessage,
  todoIdsToDelete,
  setIsFocusTitleInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            setTodos={setTodos}
            todos={todos}
            setShowError={setShowError}
            setErrorMessage={setErrorMessage}
            todoIdsToDelete={todoIdsToDelete}
            setIsFocusTitleInput={setIsFocusTitleInput}
          />
        );
      })}
      {tempTodo && (
        <TodoItem todo={tempTodo} isTempTodoLoading={isTempTodoLoading} />
      )}
    </section>
  );
};
