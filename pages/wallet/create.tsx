import { Fragment } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import { Header } from '../../components';

import type { NextPage } from 'next';

import Form from './form';

const WalletCreate: NextPage = () => {
  return (
    <Fragment>
      <Head>
        <title>Surebet - Carteiras</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto gap-6 sm:px-6 lg:max-w-7xl flex">
        <div className="w-1/5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-2">
            Formulário
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Para cadastrar uma nova carteira, preenche o formulário ao lado.
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
          <Form initials={{ balance: '0' }} />
        </div>
      </div>
    </Fragment>
  );
};

export default WalletCreate;
