import Layout from '../components/layout/layout';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import store from '../redux/store';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
      {/* <link rel="preload" href="https://db.onlinewebfonts.com/c/2c6559d94a7fa38ce73eaa827ca22ce2?family=Lust+Script+Display" as="style" /> */}
<link href="https://db.onlinewebfonts.com/c/2c6559d94a7fa38ce73eaa827ca22ce2?family=Lust+Script+Display" rel="stylesheet" />

        {/* <script src="../public/epos-2.22.0" type="text/javascript" /> */}
      </Head>
      <Provider store={store}>
        {path !== "/" ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </>
  );
}

export default MyApp;