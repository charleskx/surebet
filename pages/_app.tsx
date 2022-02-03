import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from '../context/UserContext';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-100">
        <Component {...pageProps} />
      </div>
      <ToastContainer />
    </UserProvider>
  );
}

export default MyApp;
