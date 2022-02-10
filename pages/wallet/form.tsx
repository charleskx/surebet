import { useCallback, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { Form } from '@unform/web';

import { Bookmakers } from '@prisma/client';
import axios from 'axios';

import { Select, Input, Button } from '../../components';
import { OptionsProps } from '../../components/Select';

import * as Yup from 'yup';

import { useUser } from '../../hooks/useUser';
import { FormHandles } from '@unform/core';

export interface IForm {
  bookmakerId?: string;
  login?: string;
  password?: string;
  author?: string;
  balance?: string;
  verified?: number;
  limited?: number;
}

interface IWallet {
  initials?: IForm;
  id?: number;
}

interface IErrors {
  [key: string]: string;
}

const FormWallet = ({ initials, id }: IWallet) => {
  const [loading, setLoading] = useState(false);
  const [bookmakers, setBookmakers] = useState<OptionsProps[]>([]);

  const formRef = useRef<FormHandles>(null);

  const { user } = useUser();

  const handleRequestBookmakers = useCallback(async () => {
    try {
      setLoading(true);

      await axios
        .get('/api/bookmakers')
        .then(({ data }: any) => {
          setBookmakers(
            data.map((book: Bookmakers) => ({ id: book.id, name: book.name }))
          );
        })
        .catch((error) => console.info(`Wrong! ${error}`));
    } catch (error) {
      console.info(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(
    async (data: IForm, { reset }) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          bookmakerId: Yup.string().required(),
          balance: Yup.number().min(0),
          author: Yup.string().required().min(3).max(20),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const url = id ? `/api/wallets/${id}` : '/api/wallets';

        axios({
          url,
          method: id ? 'PATCH' : 'POST',
          data: {
            ...data,
            verified: Number(data.verified) === 1,
            limited: Number(data.limited) === 1,
            balance: parseFloat(data.balance ?? '0'),
            userId: user?.id,
            bookmakerId: Number(data.bookmakerId),
          },
        })
          .then(() => {
            toast.success('Requisição enviada com sucesso!');
            if (!id) reset();
          })
          .catch((error) => console.info(`Wrong! ${error}`));
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
    [id, user?.id]
  );

  useEffect(() => {
    handleRequestBookmakers();
  }, [handleRequestBookmakers]);

  return (
    <Form
      className="w-full max-w-screen-sm"
      ref={formRef}
      onSubmit={handleSubmit}
      initialData={initials}
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Select
          name="bookmakerId"
          label="Casa de Aposta"
          disabled={Boolean(id || loading)}
          data={bookmakers}
          loading={loading}
        />

        <Input
          type="number"
          name="balance"
          step={0.01}
          placeholder="10.5"
          label="Saldo Atual"
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Input name="login" placeholder="john.doe" label="Nome de Usuário" />

        <Input
          name="password"
          type="password"
          placeholder="*****"
          label="Senha de Acesso"
        />

        <Input name="author" placeholder="John Doe" label="Responsavel" />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Select
          name="verified"
          label="Verificada"
          data={[
            { id: 0, name: 'Não' },
            { id: 1, name: 'Sim' },
          ]}
        />

        <Select
          name="limited"
          label="Limitada"
          data={[
            { id: 0, name: 'Não' },
            { id: 1, name: 'Sim' },
          ]}
        />
      </div>

      {loading ? (
        <Button disabled title="Carregando..." />
      ) : (
        <Button title={id ? 'Editar' : 'Cadastrar'} />
      )}
    </Form>
  );
};

export default FormWallet;
