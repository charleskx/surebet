import { useEffect, useMemo, Fragment, useCallback, useState } from 'react';
import { toast } from 'react-toastify';
import { FiZap, FiLogOut } from 'react-icons/fi';

import axios from 'axios';

import Image from 'next/image';
import Link from 'next/link';

import { useUser } from '../../hooks/useUser';
import { useSurebet } from '../../hooks/useSurebet';
import { formatCurrency } from '../../helper/utils';

import Logo from '../../public/logo.svg';
import { Modal, Operation } from '../';

const Header = () => {
  const [balance, setBalance] = useState<number>(0);

  const { user, onLogIn, onLogOut } = useUser();
  const { onOpenModal } = useSurebet();

  const navigation = useMemo(
    () => [
      { name: 'Entradas', href: '/input' },
      { name: 'Carteiras', href: '/wallet' },
      { name: 'Configurações', href: '/configuration' },
    ],
    []
  );

  const handleGetBalance = useCallback(async () => {
    try {
      await axios
        .get(`/api/users/balance`, {
          params: {
            user: user?.id,
          },
        })
        .then(({ data }) => setBalance(data._sum.balance ?? 0))
        .catch((error) => console.info(error));
    } catch (err) {
      console.info(`Wrong! ${err}`);
    }
  }, [user?.id]);

  // Check user logged
  useEffect(() => {
    if (!user) {
      const local = localStorage.getItem('auth');

      if (local) {
        onLogIn(JSON.parse(local), false);
      } else {
        toast.info('Você não tem permissão para acessar esta página!');
        onLogOut();
      }
    }
  }, [onLogIn, onLogOut, user]);

  useEffect(() => {
    handleGetBalance();
  }, [handleGetBalance]);

  return (
    <Fragment>
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex px-2 lg:px-0">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/dashboard">
                  <a>
                    <Image className="h-8 w-auto" alt="logomarca" src={Logo} />
                  </a>
                </Link>
              </div>
              <nav
                aria-label="Global"
                className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4"
              >
                {navigation.map((nav) => (
                  <Link href={nav.href} key={nav.name}>
                    <a className="px-3 py-2 text-gray-900 text-sm font-medium">
                      {nav.name}
                    </a>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="hidden lg:ml-4 lg:flex lg:items-center">
              <p className="mr-2 text-gray-400 p-1">
                {formatCurrency(balance)}
              </p>
              <button
                type="button"
                title="Registrar Entrada"
                className="flex-shrink-0 bg-white p-1 text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={onOpenModal}
              >
                <span className="sr-only">View notifications</span>
                <FiZap />
              </button>

              <div className="bg-white ml-4 rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <span className="sr-only">Open user menu</span>
                <span className="h-8 w-8 rounded-full bg-violet-700 text-white font-black flex items-center justify-center">
                  {user?.firstName.substring(0, 1)}
                  {user?.lastName.substring(0, 1)}
                </span>
              </div>

              <button
                type="button"
                title="Sair"
                className="flex-shrink-0 bg-white p-1 text-red-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ml-3"
                onClick={onLogOut}
              >
                <FiLogOut />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Modal />
      <Operation />
    </Fragment>
  );
};

export default Header;
