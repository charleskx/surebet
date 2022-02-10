import { ReactChildren, useMemo } from 'react';

interface IProps {
  title: string;
}

const Button = ({ title, disabled }: IProps & Partial<HTMLButtonElement>) => {
  const className = useMemo(
    () =>
      disabled
        ? 'bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed'
        : 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded',
    [disabled]
  );
  return (
    <button className={className} type="submit" disabled={disabled}>
      {title}
    </button>
  );
};

export default Button;
