import { useState, useCallback } from 'react';

import { format } from 'date-fns';
import axios from 'axios';

import { useSurebet } from '../../hooks/useSurebet';
import { useUser } from '../../hooks/useUser';
import { parseDate } from '../../helper/parseDateSurebet';

type Wallet = {
  id: number;
  name: string;
};

const Modal = () => {
  const [loading, setLoading] = useState(false);
  const [betting, setBetting] = useState('');
  const [walletHome, setWalletHome] = useState<Wallet[]>([]);

  const { open, onCancellBet } = useSurebet();
  const { user } = useUser();

  const handleCloseModal = useCallback(() => {
    onCancellBet();
    setBetting('');
  }, [onCancellBet]);

  const handleRequestWallets = useCallback(async (user) => {
    try {
      const wallets = await axios.get('/api/wallets', { params: { user } });
      return wallets.data;
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleSubmit = useCallback(
    async (event: React.SyntheticEvent) => {
      try {
        setLoading(true);

        event.preventDefault();

        const [team, homeTeam, awayTeam, coin] = betting.split('\n');

        const dateTime = parseDate(team.split('\t')[0]);
        const home = homeTeam.split('\t');
        const wallets = await handleRequestWallets(user?.id);

        const formData = {
          userId: user?.id,
          event: format(dateTime, 'yyyy-MM-dd HH:mm:ss'),
          team: team.split('\t')[1],
          category: team.split('\t')[2],
          amount: parseFloat(coin.split('\t').filter(Boolean)[0]),
        };

        setWalletHome(
          wallets.filter((wallet: any) =>
            wallet.bookmaker.name.includes(home[0]).map((wallet: any) => ({
              id: wallet.id,
              name: `${wallet.bookmaker.name} (${wallet.author})`,
            }))
          )
        );

        console.log('format', home);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [betting, handleRequestWallets, user?.id]
  );

  return (
    <section
      className={`fixed z-10 inset-0 overflow-y-auto ${!open && 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="lex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <form
          method="POST"
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          onSubmit={handleSubmit}
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Surebet
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Adicione o código do <strong>surebet.com</strong> abaixo
                    para que o sistema possa reconhecer suas entradas.
                  </p>
                </div>

                <div className="mt-2">
                  <textarea
                    placeholder="https://pt.surebet.com"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    onChange={(e) => setBetting(e.target.value)}
                    value={betting}
                    rows={4}
                    autoFocus
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={loading}
            >
              Continuar
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCloseModal}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Modal;
