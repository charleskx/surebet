import { Fragment, useCallback, useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import axios from 'axios';

import Head from 'next/head';
import Link from 'next/link';

import { Header } from '../../../components';

import { useLoading } from '../../../hooks/useLoading';

import Form, { IForm } from '../form';

import type { NextPage } from 'next';

const WalletEdit: NextPage = () => {
  const [initials, setInitials] = useState<IForm | null>(null);

  const router = useRouter();
  const { toggleLoading } = useLoading();
  const { id } = router.query;

  const handleRequestDataWallet = useCallback(async () => {
    try {
      toggleLoading(true);

      await axios
        .get(`/api/wallets/${id}`)
        .then(({ data }) =>
          setInitials({
            ...data,
            verified: Number(data.verified),
            limited: Number(data.limited),
          })
        )
        .catch((error) => console.info(`Wrong! ${error}`));
    } catch (err) {
      console.info(err);
    } finally {
      toggleLoading(false);
    }
  }, [id, toggleLoading]);

  useEffect(() => {
    handleRequestDataWallet();
  }, [handleRequestDataWallet]);

  return (
    <Fragment>
      <Head>
        <title>Surebet - Carteiras</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto gap-6 sm:px-6 lg:max-w-7xl flex">
        <div className="w-1/5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-2">
            Modificação
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Editar informações da sua carteira.
          </p>

          <nav>
            <p className="text-sm font-bold text-gray-500 uppercase mb-2">
              Navegação
            </p>
            <Link href="/wallet">
              <a className="inline-block px-6 py-2.5 bg-transparent text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-gray-100 focus:text-blue-700 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 active:text-blue-800 transition duration-300 ease-in-out">
                Minhas Carteiras
              </a>
            </Link>

            <Link href="/wallet/create">
              <a className="inline-block px-6 py-2.5 bg-transparent text-blue-600 font-medium text-xs leading-tight uppercase rounded hover:bg-gray-100 focus:text-blue-700 focus:bg-gray-100 focus:outline-none focus:ring-0 active:bg-gray-200 active:text-blue-800 transition duration-300 ease-in-out">
                Cadastrar
              </a>
            </Link>
          </nav>
        </div>

        <div className="w-full lg:border-l lg:border-gray-200 pl-8 pb-8">
          {initials ? (
            <Form initials={initials} id={Number(id)} />
          ) : (
            <p className="text-sm text-gray-500">
              Aguarde, carregando os dados da carteira...
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default WalletEdit;
