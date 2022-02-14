import { useCallback } from 'react';
import { toast } from 'react-toastify';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import axios from 'axios';
import { useUser } from '../hooks/useUser';

import SignInBG from '../public/bg/signIn.jpg';

import type { NextPage } from 'next';

const SignIn: NextPage = () => {
  const { onLogIn, onLogOut } = useUser();

  const handleSignIn = useCallback(
    async (event: React.SyntheticEvent) => {
      try {
        event.preventDefault();

        const { username, password }: any = event.target;

        await axios
          .get('/api/users', {
            params: {
              username: username.value,
              password: password.value,
            },
          })
          .then(({ data }) => {
            const user = data.shift();

            if (typeof user === 'undefined') {
              onLogOut();
              toast.error('Nome de usuário e/ou senha incorretos!');
            } else {
              onLogIn(user, true);
            }
          });
      } catch (err) {
        onLogOut();
        toast.error('Wrong!');
      }
    },
    [onLogIn, onLogOut]
  );

  return (
    <>
      <Head>
        <title>Surebet - Login</title>
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
              Faça login na sua conta
            </h1>

            <form className="mt-6" method="POST" onSubmit={handleSignIn}>
              <div>
                <label className="block text-gray-700" htmlFor="username">
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="John"
                  className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                  autoFocus
                  required
                />
              </div>

              <div className="mt-4">
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

              <div className="text-right mt-2">
                <Link href="#">
                  <a className="text-sm font-semibold text-gray-700 hover:text-blue-700 focus:text-blue-700">
                    Esqueceu a senha?
                  </a>
                </Link>
              </div>

              <button
                type="submit"
                className="w-full block bg-indigo-500 hover:bg-indigo-400 focus:bg-indigo-400 text-white font-semibold rounded-lg
              px-4 py-3 mt-6"
              >
                Entrar
              </button>
            </form>

            <hr className="my-6 border-gray-300 w-full" />

            <p className="mt-8">
              Precisa de uma conta?{' '}
              <Link href="/signup">
                <a className="text-blue-500 hover:text-blue-700 font-semibold">
                  Crie a sua conta aqui
                </a>
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
