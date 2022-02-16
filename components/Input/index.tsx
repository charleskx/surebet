import { useEffect, useRef, useMemo } from 'react';
import { useField } from '@unform/core';

type Props = {
  name: string;
  label: string;
};

type InputProps = JSX.IntrinsicElements['input'] & Props;

const Input = ({ name, label, ...rest }: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

  const className = useMemo(
    () =>
      error
        ? 'disabled:opacity-60 appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white'
        : 'disabled:opacity-60 appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500',
    [error]
  );

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => ref.current.value,
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = '';
      },
    });
  }, [fieldName, registerField]);

  return (
    <div className="w-full mb-6 md:mb-0">
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
        htmlFor={name}
      >
        {label}
      </label>

      <input
        className={className}
        ref={inputRef}
        name={name}
        id={name}
        defaultValue={defaultValue}
        {...rest}
      />

      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default Input;
