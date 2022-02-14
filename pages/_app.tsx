import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';

import { UserProvider } from '../context/UserContext';
import { SurebetProvider } from '../context/SurebetContext';
import { OperationProvider } from '../context/OperationContext';

import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.min.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SurebetProvider>
        <OperationProvider>
          <div className="min-h-screen bg-gray-100">
            <Component {...pageProps} />
          </div>
          <ToastContainer />
        </OperationProvider>
      </SurebetProvider>
    </UserProvider>
  );
}

export default MyApp;
