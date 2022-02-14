import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from '../context/UserContext';
import { SurebetProvider } from '../context/SurebetContext';
import { OperationProvider } from '../context/OperationContext';
import { LoadingProvider } from '../context/LoadingContext';

import { Loading } from '../components';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SurebetProvider>
        <OperationProvider>
          <LoadingProvider>
            <div className="min-h-screen bg-gray-100">
              <Component {...pageProps} />
            </div>

            <Loading />
          </LoadingProvider>
          <ToastContainer />
        </OperationProvider>
      </SurebetProvider>
    </UserProvider>
  );
}

export default MyApp;
