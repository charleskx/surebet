import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from '../context/UserContext';
import { SurebetProvider } from '../context/SurebetContext';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SurebetProvider>
        <div className="min-h-screen bg-gray-100">
          <Component {...pageProps} />
        </div>
        <ToastContainer />
      </SurebetProvider>
    </UserProvider>
  );
}

export default MyApp;
