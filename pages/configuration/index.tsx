import { Fragment } from 'react';
import type { NextPage } from 'next';

import Head from 'next/head';

import { Header } from '../../components';

import { useUser } from '../../hooks/useUser';

import Form from './form';

const Configurations: NextPage = () => {
  const { user } = useUser();

  return (
    <Fragment>
      <Head>
        <title>Surebet - Minhas Carteiras</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto gap-6 sm:px-6 lg:max-w-7xl flex">
        <div className="w-1/5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-2">
            Formulário
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Para atualizar seus dados cadastrais, preenche o formulário ao lado.
          </p>
        </div>

        <div className="w-full lg:border-l lg:border-gray-200 pl-8 pb-8">
          {user ? (
            <Form initials={user} />
          ) : (
            <p className="text-sm text-gray-500">
              Aguarde, carregando os dados do usuário...
            </p>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Configurations;
