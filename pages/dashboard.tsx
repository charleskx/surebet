import type { NextPage } from 'next';

import { useUser } from '../hooks/useUser';

import { Header, Profit } from '../components';

import Head from 'next/head';

const Dashboard: NextPage = () => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>Surebet - Dashboard</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto sm:px-6 lg:max-w-7xl">
        <p className="font-mono text-slate-800 text-2xl">
          Bem vindo de volta,
          <span className="font-bold"> {user?.firstName}</span> 👋
        </p>
        <div className="grid grid-cols-3 gap-6 mt-6">
          <Profit />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
