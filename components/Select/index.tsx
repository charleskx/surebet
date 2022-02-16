import { useEffect, useRef } from 'react';
import { useField } from '@unform/core';

export interface OptionsProps {
  id: any;
  name: string;
}

interface Props {
  name: string;
  label?: string;
  data: OptionsProps[];
  loading?: boolean;
}

type InputProps = JSX.IntrinsicElements['select'] & Props;

const Select = ({ data, name, label, loading, ...rest }: InputProps) => {
  const inputRef = useRef<HTMLSelectElement>(null);

  const { fieldName, defaultValue, registerField, error } = useField(name);

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
      {label && (
        <label
          className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
          htmlFor={fieldName}
        >
          {label}
        </label>
      )}

      <div className="relative">
        {loading ? (
          <p className="text-sm text-gray-500 mb-6">
            Carregando dados do campo, aguarde...
          </p>
        ) : (
          <select
            className={`disabled:opacity-60 block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 ${
              error && 'border-red-500'
            }`}
            id={fieldName}
            ref={inputRef}
            defaultValue={defaultValue}
            {...rest}
          >
            <option disabled selected value="">
              Selecionar
            </option>
            {data.map((option: OptionsProps) => (
              <option
                value={option.id}
                key={Math.random()}
                selected={defaultValue === option.id}
              >
                {option.name}
              </option>
            ))}
          </select>
        )}

        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>

      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default Select;
