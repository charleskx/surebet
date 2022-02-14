import { useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import axios from 'axios';
import * as Yup from 'yup';

import { useUser } from '../../hooks/useUser';
import { useOperation } from '../../hooks/useOperation';
import { Select, Button } from '../';

interface IErrors {
  [key: string]: string;
}

interface IForm {
  surebet: string;
}

const Operation = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { user } = useUser();
  const { open, onCloseModal, value } = useOperation();

  const handleCloseModal = useCallback(() => {
    onCloseModal();
    formRef.current?.reset();
  }, [onCloseModal]);

  const handleSubmit = useCallback(
    async (data: IForm) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          surebet: Yup.string().required(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (value.events) {
          if (data.surebet === '0') {
            const { id } = value.events[0];

            await axios.put(`/api/events/${id}`, {
              operationId: value.id,
              double: true,
            });
          } else {
            await axios.put(`/api/events/${data.surebet}`, {
              operationId: value.id,
              double: false,
            });
          }

          toast.success('Entrada atualizada com sucesso!');
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
    [handleCloseModal, value.events, value.id]
  );

  if (value.events)
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
          <Form
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full max-w-md"
            onSubmit={handleSubmit}
            ref={formRef}
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3
                    className="text-lg leading-6 font-medium text-gray-900"
                    id="modal-title"
                  >
                    Vencedora
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Selecione a casa de aposta ganhadora. <br />
                      <strong>Todas</strong>: Quando as duas ou mais entradas
                      vencem.
                    </p>
                  </div>

                  <div className="mt-6">
                    <Select
                      name="surebet"
                      label="Casa de Aposta"
                      data={[
                        ...value.events.map((event: any) => ({
                          id: event.id,
                          name: event.wallet.bookmaker.name,
                        })),
                        { id: 0, name: 'Todas' },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
              <Button
                title={loading ? 'Carregando...' : 'Finalizar'}
                disabled={loading}
              />
            </div>
          </Form>
        </div>
      </section>
    );

  return <div />;
};

export default Operation;
