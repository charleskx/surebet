import { useCallback } from 'react';
import { toast } from 'react-toastify';

import Route from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import axios from 'axios';
import { useUser } from '../hooks/useUser';

import SignInBG from '../public/bg/signIn.jpg';

import type { NextPage } from 'next';

const SignUp: NextPage = () => {
  const { onLogIn, onLogOut } = useUser();

  const handleSignUp = useCallback(
    async (event: React.SyntheticEvent) => {
      try {
        event.preventDefault();

        const { firstName, lastName, username, email, password }: any =
          event.target;

        await axios
          .post('/api/users', {
            params: {
              firstName: firstName.value,
              lastName: lastName.value,
              username: username.value,
              email: email.value,
              password: password.value,
            },
          })
          .then(({ data }) => {
            onLogIn(data);
          });
      } catch (err) {
        toast.error('Oops! Erro ao cadastrar usuário');
        onLogOut();
      }
    },
    [onLogIn, onLogOut]
  );

  return (
    <>
      <Head>
        <title>Surebet - Cadastro</title>
      </Head>

      <section className="flex flex-col md:flex-row h-screen items-center">
        <div className="bg-indigo-600 hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen relative">
          <Image
            src={SignInBG}
            alt="homem fazendo uma cesta no basquete"
            className="w-full h-full object-cover"
            layout="fill"
          />
        </div>

        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:mx-0 md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
          <div className="w-full h-100">
            <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
              Registre-se
            </h1>

            <form className="mt-6" method="POST" onSubmit={handleSignUp}>
              <div className="flex mb-4">
                <div className="flex-auto w-64">
                  <label className="block text-gray-700" htmlFor="firstName">
                    Nome
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    placeholder="John"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex-auto ml-4">
                  <label className="block text-gray-700" htmlFor="lastName">
                    Sobrenome
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    placeholder="Doe"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="username">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Nome de Usuário"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700" htmlFor="email">
                  Endereço de e-mail
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="john@doe.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700" htmlFor="password">
                  Senha
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="*****"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg px-4 py-3 mt-6"
              >
                Cadastrar
              </button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-8">
              Já possui uma conta?{' '}
              <Link href="/">
                <a className="text-blue-500 hover:text-blue-700 font-semibold">
                  Entrar!
                </a>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
