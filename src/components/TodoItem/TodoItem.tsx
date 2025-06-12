/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect } from 'react';
import { Todo } from '../../types/Todo';
import cn from 'classnames';
import { client } from '../../utils/fetchClient';
import { ErrorMessage } from '../../types/ErrorStatusType';

type TodoItemProps = {
  todo: Todo;
  todos?: Todo[] | null;
  setTodos?: (todos: Todo[]) => void;
  isTempTodoLoading?: boolean | null;
  setShowError?: (value: boolean) => void;
  setErrorMessage?: (errorMessage: ErrorMessage) => void;
  todoIdsToDelete?: number[];
  setIsFocusTitleInput?: (value: boolean) => void;
};

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  todos,
  isTempTodoLoading,
  setTodos,
  setShowError,
  setErrorMessage,
  todoIdsToDelete,
  setIsFocusTitleInput,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isTempTodoLoading) {
      setIsLoading(isTempTodoLoading);
    }
  }, [isTempTodoLoading]);

  useEffect(() => {
    if (todoIdsToDelete && todoIdsToDelete.includes(todo.id)) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [todoIdsToDelete, todo.id]);

  const handleOnClickDelete = () => {
    setIsLoading(true);
    if (setIsFocusTitleInput) {
      setIsFocusTitleInput(true);
    }

    client
      .delete(`/todos/${todo.id}`)
      .then(() => {
        if (todos && setTodos) {
          setTodos(todos.filter(todoItem => todoItem.id !== todo.id));
        }
      })
      .catch(() => {
        if (setShowError && setErrorMessage) {
          setShowError(true);
          setErrorMessage(ErrorMessage.DeleteTodo);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: todo.completed })}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
        />
      </label>
      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleOnClickDelete}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading || isTempTodoLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
