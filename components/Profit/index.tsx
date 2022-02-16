import { useRef, useState, useCallback, useEffect } from 'react';
import { FiFilter } from 'react-icons/fi';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { format } from 'date-fns';

import * as Yup from 'yup';
import axios from 'axios';

import { useUser } from '../../hooks/useUser';
import { useLoading } from '../../hooks/useLoading';
import {
  formatCurrency,
  getFirstDayOfWeek,
  getFirstDayOfMonth,
} from '../../helper/utils';

import { Select } from '../';

interface IForm {
  period: number;
}

interface IErrors {
  [key: string]: string;
}

const Profit = () => {
  const [currency, setCurrency] = useState(0);
  const [initials, setInitials] = useState({ period: '0' });

  const formRef = useRef<FormHandles>(null);

  const { toggleLoading, loading } = useLoading();
  const { user } = useUser();

  const handleRequeustCurrency = useCallback(
    async (period: string) => {
      try {
        toggleLoading(true);
        setInitials({ period });

        let params = {
          start: '',
          end: '',
          user: user?.id,
        };

        switch (period) {
          case '0':
            params.start = format(new Date(), 'yyyy-MM-dd');
            params.end = '';
            break;
          case '1':
            params.start = format(getFirstDayOfWeek(), 'yyyy-MM-dd');
            params.end = format(new Date(), 'yyyy-MM-dd');
            break;
          case '2':
            params.start = format(getFirstDayOfMonth(), 'yyyy-MM-dd');
            params.end = format(new Date(), 'yyyy-MM-dd');
            break;
          case '3':
          default:
            params.start = format(new Date(), 'yyyy-01-01');
            params.end = format(new Date(), 'yyyy-MM-dd');
            break;
        }

        await axios.get('/api/abstract', { params }).then(({ data }) => {
          let money = 0;

          data.forEach((i: any) => {
            if (i.double) money += i.amount * 2;
            i.events.forEach((event: any) => {
              money += event.profit;
            });
          });

          setCurrency(money);
        });
      } catch (err) {
        console.info(`Wrong! ${err}`);
      } finally {
        toggleLoading(false);
      }
    },
    [toggleLoading, user?.id]
  );

  const handleSubmit = useCallback(
    async (data: IForm) => {
      try {
        const schema = Yup.object().shape({
          period: Yup.number().required(),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await handleRequeustCurrency(data.period.toString());
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const validationErrors: IErrors = {};

          err.inner.forEach((error) => {
            if (error.path) validationErrors[error.path] = error.message;
          });

          formRef.current?.setErrors(validationErrors);
        }
      }
    },
    [handleRequeustCurrency]
  );

  useEffect(() => {
    handleRequeustCurrency('0');
  }, [handleRequeustCurrency]);

  return (
    <div className="bg-white rounded shadow-lg p-6">
      <Form
        className="w-full"
        ref={formRef}
        onSubmit={handleSubmit}
        initialData={initials}
      >
        <div className="flex items-center border-b border-teal-500 py-2">
          <Select
            name="period"
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            data={[
              { id: '0', name: 'Dia' },
              { id: '1', name: 'Semana' },
              { id: '2', name: 'Mês' },
              { id: '3', name: 'Ano' },
            ]}
          />

          <button
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:opacity-20"
            type="submit"
            disabled={loading}
          >
            <FiFilter />
          </button>
        </div>
      </Form>
      <div className="mt-4 text-center font-mono">
        <p className="font-thin text-xs text-slate-500">Seu lucro foi de:</p>
        <p className="font-bold text-2xl text-blue-700 mt-2">
          {formatCurrency(currency)}
        </p>
      </div>
    </div>
  );
};

export default Profit;
