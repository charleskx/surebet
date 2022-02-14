import { useMemo } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

import { useLoading } from '../../hooks/useLoading';

const Loading = () => {
  const { loading } = useLoading();

  const className = useMemo(
    () =>
      loading
        ? 'fixed bottom-9 right-12 inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-stone-700 hover:bg-stone-400 transition ease-in-out duration-150 cursor-not-allowed'
        : 'hidden',
    [loading]
  );

  return (
    <button type="button" className={className}>
      <AiOutlineLoading3Quarters className="animate-spin h-5 w-5 mr-3" />
      Carregando...
    </button>
  );
};

export default Loading;
