import { useState, useCallback, useEffect, Fragment } from 'react';
import { FiDollarSign, FiX, FiSlash, FiThumbsUp } from 'react-icons/fi';

import type { NextPage } from 'next';
import { Operations } from '@prisma/client';
import { parseISO, format } from 'date-fns';

import axios from 'axios';

import Head from 'next/head';

import { formatCurrency, limitText } from '../helper/utils';
import { Header } from '../components';
import { useUser } from '../hooks/useUser';
import { useOperation } from '../hooks/useOperation';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';

const Inputs: NextPage = () => {
  const [operations, setOperations] = useState<Operations[]>([]);

  const { user } = useUser();
  const { onOpenModal, open } = useOperation();

  const handleGetOperations = useCallback(async () => {
    try {
      await axios
        .get('/api/operations', { params: { user: user?.id } })
        .then(({ data }) => setOperations(data));
    } catch (err) {
      console.info(`Wrong! ${err}`);
    }
  }, [user?.id]);

  const handleClassNameTR = useCallback((operation: Operations): string => {
    if (operation.canceled) return 'bg-yellow-100';
    if (operation.double || operation.finished) return 'bg-green-100';

    return '';
  }, []);

  const handleRemoveOperation = useCallback(
    async (id: number): Promise<void> => {
      try {
        await axios
          .delete(`/api/operations/${id}`)
          .then(() => {
            toast.success('Entrada removida com sucesso!');
            handleGetOperations();
          })
          .catch((error) => console.info(`Wrong! ${error}`));
      } catch (err) {
        console.info(err);
      }
    },
    [handleGetOperations]
  );

  const handleCancelloperation = useCallback(
    async (id: number): Promise<void> => {
      try {
        await axios
          .patch(`/api/operations/${id}`, {
            canceled: true,
          })
          .then(() => {
            toast.success('Entrada cancelada com sucesso!');
            handleGetOperations();
          })
          .catch((err) => console.info(`Wrong! ${err}`));
      } catch (err) {
        console.info(err);
      }
    },
    [handleGetOperations]
  );

  useEffect(() => {
    handleGetOperations();
  }, [handleGetOperations, open]);

  return (
    <>
      <Head>
        <title>Surebet - Carteiras</title>
      </Head>

      <Header />

      <div className="mt-8 pb-8 max-w-3xl mx-auto gap-6 sm:px-6 lg:max-w-7xl flex">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data/Hora do Evento
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Responsável
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Casa de Aposta
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Mercado
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
              >
                Investimento
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Ganho
              </th>
              <th
                scope="col"
                className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Vitoria
              </th>
              <th scope="col" className="relative px-3 py-3">
                <span className="sr-only">Edit</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {operations.map((operation: any) => (
              <Fragment key={Math.random()}>
                <tr className={handleClassNameTR(operation)}>
                  <td className="px-3 py-4 whitespace-nowrap" rowSpan={3}>
                    <p className="text-xs text-neutral-700 font-bold">
                      {format(parseISO(operation.event.toString()), 'Pp', {
                        locale: ptBR,
                      })}
                    </p>
                  </td>
                </tr>

                {[...operation.events].reverse().map((event: any, key) => (
                  <tr
                    key={Math.random()}
                    className={handleClassNameTR(operation)}
                  >
                    <td className="px-3 py-4 whitespace-nowra">
                      <p
                        className="text-xs text-gray-900"
                        title={event.wallet.author}
                      >
                        {event.wallet.author}
                      </p>
                    </td>
                    <td className="px-3 py-4 whitespace-nowra">
                      <p
                        className="text-xs text-gray-900 text-center"
                        title={event.wallet.bookmaker.name}
                      >
                        {event.wallet.bookmaker.name}
                      </p>
                    </td>
                    <td className="px-3 py-4 whitespace-nowra">
                      <p
                        className="text-xs text-gray-900 text-center"
                        title={event.market}
                      >
                        {limitText({ limit: 20, text: event.market })}
                      </p>
                    </td>
                    <td className="px-3 py-4 whitespace-nowra">
                      <p className="text-xs text-lime-900 font-bold text-center">
                        {formatCurrency(parseFloat(event.input))}
                      </p>
                    </td>
                    <td className="px-3 py-4 whitespace-nowra">
                      <p className="text-xs text-lime-900 font-bold text-center">
                        {parseFloat(event.profit).toLocaleString('pt-br', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </p>
                    </td>
                    <td className="px-3 py-4 whitespace-nowra">
                      <p
                        className="text-xs text-lime-900 font-bold flex justify-center"
                        title="Ganhou!"
                      >
                        {event.win ? <FiDollarSign /> : '-'}
                      </p>
                    </td>
                    {key === 0 && (
                      <td className="px-3 py-4 whitespace-nowra" rowSpan={2}>
                        <div className="grid grid-cols-3">
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="bg-transparent text-rose-600 hover:text-rose-900 flex items-center pl-2 pr-2 rounded text-sm"
                              title="Excluir"
                              onClick={() =>
                                window.confirm(
                                  'Tem certeza que deseja remover estas entradas?'
                                ) && handleRemoveOperation(operation.id)
                              }
                            >
                              <FiX />
                            </button>
                          </div>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="bg-transparent text-yellow-600 hover:text-yellow-900 flex items-center pl-2 pr-2 rounded text-sm disabled:opacity-20"
                              title="Aposta Cancelada"
                              onClick={() =>
                                window.confirm(
                                  'Deseja continuar com o cancelamento do evento?'
                                ) && handleCancelloperation(operation.id)
                              }
                              disabled={
                                operation.finished ||
                                operation.canceled ||
                                operation.double
                              }
                            >
                              <FiSlash />
                            </button>
                          </div>
                          <div className="flex justify-center">
                            <button
                              type="button"
                              className="bg-transparent text-green-600 hover:text-green-900 flex items-center pl-2 pr-2 rounded text-sm disabled:opacity-20"
                              title="Definir Entrada Vencedora"
                              onClick={() => onOpenModal(operation)}
                              disabled={
                                operation.finished ||
                                operation.canceled ||
                                operation.double
                              }
                            >
                              <FiThumbsUp />
                            </button>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Inputs;
