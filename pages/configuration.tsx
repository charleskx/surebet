import Head from 'next/head';

import { Header } from '../components';

import type { NextPage } from 'next';

const Configurations: NextPage = () => {
  return (
    <>
      <Head>
        <title>Surebet - Configuração</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
        Dashboard
      </div>
    </>
  );
};

export default Configurations;
