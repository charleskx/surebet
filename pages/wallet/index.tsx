/* eslint-disable @next/next/no-img-element */
import { Fragment, useState, useCallback, useEffect } from 'react';
import { FiEdit, FiX, FiEye } from 'react-icons/fi';

import Head from 'next/head';
import Link from 'next/link';

import axios from 'axios';

import { useUser } from '../../hooks/useUser';

import { Header } from '../../components';

import type { NextPage } from 'next';
import { toast } from 'react-toastify';

const Wallet: NextPage = () => {
  const [wallets, setWallets] = useState<any>([]);

  const { user } = useUser();

  const handleRequestWallets = useCallback(async () => {
    try {
      await axios
        .get('/api/wallets', { params: { user: user?.id } })
        .then((success) => {
          setWallets(success.data);
        })
        .catch((error) => console.info(`Wrong! ${error}`));
    } catch (err) {
      console.info(err);
    }
  }, [user?.id]);

  const handleRemoveWallet = useCallback(
    async (id) => {
      try {
        await axios
          .delete(`/api/wallets/${id}`)
          .then(() => {
            toast.success('Carteira removida!');
            handleRequestWallets();
          })
          .catch((error) => console.info(`Wrong! ${error}`));
      } catch (err) {
        console.info(err);
      }
    },
    [handleRequestWallets]
  );

  useEffect(() => {
    handleRequestWallets();
  }, [handleRequestWallets]);

  return (
    <Fragment>
      <Head>
        <title>Surebet - Minhas Carteiras</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto gap-6 sm:px-6 lg:max-w-7xl flex">
        <div className="w-1/5">
          <p className="text-sm font-bold text-gray-500 uppercase mb-2">
            Carteiras
          </p>

          <p className="text-sm text-gray-500 mb-6">
            Ao lado estão todas as suas carteiras cadastradas.
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
          <div className="grid grid-cols-3 gap-6">
            {wallets.map((wallet: any) => (
              <div key={wallet.id} className="bg-white rounded shadow-lg">
                <div className="p-6 flex align-middle">
                  <div className="w-full">
                    <p className="text-sm text-slate-800">{wallet.author}</p>
                    <p className="text-sm text-slate-400">
                      {wallet.balance.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </p>
                  </div>

                  <div className="h-10 w-12 bg-stone-800 rounded-full flex align-middle items-center">
                    <img
                      src={wallet?.bookmaker.picture}
                      alt={wallet?.bookmaker.name}
                      className="w-10"
                      title={wallet?.bookmaker.name}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 divide-x p-4 border-t border-gray-200">
                  <div className="flex justify-center">
                    <Link href={`/wallet/${wallet.id}/edit`}>
                      <a className="bg-transparent text-blue-700 hover:text-sky-900 flex items-center pl-2 pr-2 rounded text-sm">
                        <FiEdit className="mr-1" />
                        Editar
                      </a>
                    </Link>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="bg-transparent text-rose-600 hover:text-rose-900 flex items-center pl-2 pr-2 rounded text-sm"
                      onClick={() =>
                        window.confirm(
                          `Tem certeza que deseja remover a ${wallet.bookmaker.name} das suas carteiras?`
                        ) && handleRemoveWallet(wallet.id)
                      }
                    >
                      <FiX className="mr-1" />
                      Excluir
                    </button>
                  </div>
                  <div className="flex justify-center">
                    <button className="bg-transparent text-teal-600 hover:text-teal-900 flex items-center pl-2 pr-2 rounded text-sm">
                      <FiEye className="mr-1" />
                      Senha
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Wallet;
