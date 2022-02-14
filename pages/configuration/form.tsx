import { useCallback, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import axios from 'axios';

import { Input, Button } from '../../components';

import * as Yup from 'yup';

import { useUser } from '../../hooks/useUser';
import { useLoading } from '../../hooks/useLoading';

export interface IForm {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface IWallet {
  initials: any;
}

interface IErrors {
  [key: string]: string;
}

const FormConfiguration = ({ initials }: IWallet) => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { user } = useUser();
  const { toggleLoading } = useLoading();

  const handleSubmit = useCallback(
    async (data: IForm) => {
      try {
        toggleLoading(true);
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          firstName: Yup.string().required().min(3),
          lastName: Yup.string().required().min(3),
          email: Yup.string().required().email(),
          password: Yup.string().required().min(3),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await axios({
          url: `/api/users/${user?.id}`,
          method: 'PATCH',
          data,
        })
          .then(() => {
            toast.success('Dados atualizados com sucesso!');
            toast.info(
              'Você verá os dados atualizado a proxima vez que acessar o sistema.'
            );
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
        toggleLoading(false);
      }
    },
    [toggleLoading, user?.id]
  );

  return (
    <Form
      className="w-full max-w-screen-sm"
      ref={formRef}
      onSubmit={handleSubmit}
      initialData={initials}
    >
      <div className="grid grid-cols-2 gap-6 mb-6">
        <Input name="firstName" placeholder="John" label="Nome" />

        <Input name="lastName" placeholder="Doe" label="Sobrenome" />
      </div>

      <div className="mb-6">
        <Input
          name="email"
          type="email"
          placeholder="john@doe.com"
          label="Endereço de e-mail"
        />
      </div>

      <div className="mb-6">
        <Input
          name="password"
          type="password"
          placeholder="*****"
          label="Senha de acesso"
        />
      </div>

      <Button
        disabled={loading}
        title={loading ? 'Carregando...' : 'Atualizar'}
      />
    </Form>
  );
};

export default FormConfiguration;
