import Layout from '../components/layout/layout';
import '../styles/globals.css';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AppContexts from '../context/appContext';

function MyApp({ Component, pageProps }) {
  const [path, setPath] = useState(null);
  const router = useRouter()

  useEffect(() => {
    const pathName = window.location.pathname;
    setPath(pathName);
  }, [router.pathname]);

  if (path === null) {
    return null; // Render nothing until path is set
  }

  return (
    <>
      <Head>
        <link href="https://db.onlinewebfonts.com/c/2c6559d94a7fa38ce73eaa827ca22ce2?family=Lust+Script+Display" rel="stylesheet" />
      </Head>
      <AppContexts>
        {path !== "/" ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
     </AppContexts>
    </>
  );
}

export default MyApp;