import '../styles/globals.css'
import type { AppProps } from 'next/app'
import AppContextProvider from 'context/AppContext'
import { Toaster } from 'react-hot-toast';
import { Layout } from 'components';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <Layout>
        <Toaster />
        <Component {...pageProps} />
      </Layout>
    </AppContextProvider>
  );
}

export default MyApp
