import React, { useEffect, useRef, useState } from 'react';
import { client } from '../../utils/fetchClient';
import { USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorStatusType';

type FormComponentProps = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  setShowError: (value: boolean) => void;
  setErrorMessage: (errorMessage: string) => void;
  setTempTodo: (todo: Todo | null) => void;
  isTempTodoLoading: boolean;
  setIsTempTodoLoading: (value: boolean) => void;
  isFocusTitleInput: boolean;
  setIsFocusTitleInput: (value: boolean) => void;
};

export const FormComponent: React.FC<FormComponentProps> = ({
  todos,
  setTodos,
  setShowError,
  setErrorMessage,
  setTempTodo,
  isTempTodoLoading,
  setIsTempTodoLoading,
  isFocusTitleInput,
  setIsFocusTitleInput,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (isFocusTitleInput) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
      setIsFocusTitleInput(false);
    }
  }, [isFocusTitleInput, setIsFocusTitleInput]);

  const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoTitle(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent) => {
    event.preventDefault();
    if (!newTodoTitle.trim()) {
      setShowError(true);
      setErrorMessage(ErrorMessage.EmptyTitle);
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });

      return;
    }

    setIsTempTodoLoading(true);

    const temp = {
      id: 0,
      title: newTodoTitle.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(temp);

    client
      .post<Todo>('/todos', temp)
      .then(createdTodo => {
        setTodos([...todos, createdTodo]);
        setNewTodoTitle('');
        setTempTodo(null);
        setIsFocusTitleInput(true);
      })
      .catch(() => {
        setTempTodo(null);
        setShowError(true);
        setErrorMessage(ErrorMessage.AddTodo);
        setIsTempTodoLoading(false);
        setIsFocusTitleInput(true);
      })
      .finally(() => {
        setIsTempTodoLoading(false);
        setIsFocusTitleInput(true);
      });
  };

  return (
    <form onSubmit={handleSubmitForm}>
      <input
        ref={inputRef}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={handleChangeInput}
        disabled={isTempTodoLoading}
      />
    </form>
  );
};
