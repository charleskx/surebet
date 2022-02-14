import { useState, useCallback, useRef, useMemo } from 'react';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import axios from 'axios';
import * as Yup from 'yup';

import Image from 'next/image';

import { useSurebet } from '../../hooks/useSurebet';
import { useUser } from '../../hooks/useUser';
import { parseDate } from '../../helper/parseDateSurebet';
import { TextArea, Select } from '../';
import { removeZeroWidth } from '../../helper/utils';

import Loading from '../../public/loading.gif';
import { Operations, Wallets } from '@prisma/client';
import { toast } from 'react-toastify';

interface IForm {
  surebet?: string;
  homeTeam?: number;
  visitingTeam?: number;
}

interface IErrors {
  [key: string]: string;
}

const Modal = () => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [operation, setOperation] = useState<Operations>();
  const [teams, setTeams] = useState<string[]>([]);
  const [wallets, setWallets] = useState<Wallets[]>([]);

  const formRef = useRef<FormHandles>(null);

  const className = useMemo(
    () =>
      step === 1
        ? 'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full'
        : 'inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full',
    [step]
  );

  const { open, onCancellBet } = useSurebet();
  const { user } = useUser();

  const handleCloseModal = useCallback(() => {
    onCancellBet();

    setStep(1);
    setOperation(undefined);
    setTeams([]);
    setWallets([]);

    formRef.current?.reset();
  }, [onCancellBet]);

  const handleRequestWallets = useCallback(async () => {
    try {
      setLoading(true);

      const wallets = await axios.get('/api/wallets', {
        params: { user: user?.id },
      });

      setWallets(wallets.data);
    } catch (error) {
      console.info(`Wrong! ${error}`);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const handleSubmit = useCallback(
    async (data: IForm, { reset }) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          surebet:
            step === 1
              ? Yup.string().required().min(50)
              : Yup.string().nullable(),
          homeTeam:
            step === 2
              ? Yup.number().required().min(1)
              : Yup.number().nullable(),
          visitingTeam:
            step === 2
              ? Yup.number().required().min(1)
              : Yup.number().nullable(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        //Performs the first step interactions
        if (step === 1 && data.surebet) {
          const [team, homeTeam, awayTeam, coin] = data.surebet.split('\n');

          // await axios
          //   .post('/api/operations', {
          //     userId: user?.id,
          //     event: parseDate(team.split('\t')[0]),
          //     team: team.split('\t')[1],
          //     category: team.split('\t')[2],
          //     amount: parseFloat(coin.split('\t').filter(Boolean)[0]),
          //   })
          //   .then(({ data }) => {
          //     setTeams([homeTeam, awayTeam]);
          //     setOperation(data);
          //     setStep(2);
          //     reset();

          //     handleRequestWallets();
          //   });

          setTeams([homeTeam, awayTeam]);
          setStep(2);
          reset();

          handleRequestWallets();
        }

        // Log the events
        if (step === 2 && operation && teams) {
          const events: any = [];

          teams.forEach((tem, key) => {
            const teamData = tem
              .split('\t')
              .filter((_, key) => [0, 1, 2, 5, 8].includes(key));

            events.push({
              walletId: Number(key === 0 ? data.homeTeam : data.visitingTeam),
              market: teamData[1],
              odd: parseFloat(teamData[2]),
              input: parseFloat(teamData[3]),
              profit: parseFloat(teamData[4]),
            });
          });

          await axios.post('/api/operations/events', {
            operationId: Number(operation.id),
            events,
          });

          toast.success('Entrada realizada com sucesso!');
          handleCloseModal();
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors: IErrors = {};

          err.inner.forEach((error) => {
            if (error.path) validationErrors[error.path] = error.message;
          });

          formRef.current?.setErrors(validationErrors);
        }
      } finally {
        setLoading(false);
      }
    },
    [handleCloseModal, handleRequestWallets, operation, step, teams, user?.id]
  );

  const handleGetOptionsWallet = useCallback(
    (bet?: string): any[] => {
      if (bet) {
        return wallets
          .filter((wallet: any) =>
            removeZeroWidth(wallet.bookmaker.name).includes(
              removeZeroWidth(bet).split(' ')[0]
            )
          )
          .map((wallet: any) => ({
            id: wallet.id,
            name: wallet.author,
          }));
      }

      return [];
    },
    [wallets]
  );

  return (
    <section
      className={`fixed z-10 inset-0 overflow-y-auto ${!open && 'hidden'}`}
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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

        <Form className={className} onSubmit={handleSubmit} ref={formRef}>
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
                  {loading ? (
                    <p className="text-sm text-gray-500">
                      Por favor, aguarde enquanto o sistema carrega as
                      informações da sua entrada.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Adicione as informações da calculadora surebet abaixo para
                      que o sistema possa reconhecer suas entradas.
                    </p>
                  )}
                </div>

                {loading ? (
                  <Image src={Loading} layout="responsive" alt="Carregamento" />
                ) : (
                  <div className="mt-6">
                    {step === 1 ? (
                      <TextArea
                        name="surebet"
                        label="Calculadora Surebet"
                        placeholder="sexta-feira, 11 de fevereiro de 2022 12:00..."
                        rows={4}
                        autoFocus
                      />
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Responsável
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Casa de Aposta
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              ODD
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Aposta
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Lucro
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {teams.map((team, key) => (
                            <tr key={Math.random()}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  <Select
                                    name={
                                      key === 0 ? 'homeTeam' : 'visitingTeam'
                                    }
                                    data={handleGetOptionsWallet(
                                      team
                                        .split('\t')
                                        .find((_, key) => key === 0)
                                    )}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {team.split('\t').find((_, key) => key === 0)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {team.split('\t').find((_, key) => key === 2)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {parseFloat(
                                    team
                                      .split('\t')
                                      .find((_, key) => key === 5) ?? ''
                                  ).toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {parseFloat(
                                    team
                                      .split('\t')
                                      .find((_, key) => key === 8) ?? ''
                                  ).toLocaleString('pt-br', {
                                    style: 'currency',
                                    currency: 'BRL',
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {!loading && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={loading}
              >
                {step === 1 ? 'Processar' : 'Finalizar Entrada'}
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
          )}
        </Form>
      </div>
    </section>
  );
};

export default Modal;
