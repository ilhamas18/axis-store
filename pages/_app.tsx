import "../src/assets/styles/main.scss";
import type { AppProps } from "next/app";
import React, { FC } from "react";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";
import { store, persistor } from "store";
import Layout from "@components/pages/layout";
import NextNProgress from "nextjs-progressbar";
import TagManager from "react-gtm-module";
import { PercentContextProvider } from "src/context/PercentContext";
import { ToastContextProvider } from "src/context/ToastContext";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <PercentContextProvider>
        <PersistGate persistor={persistor} loading={<></>}>
          <NextNProgress />
          <ToastContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ToastContextProvider>
        </PersistGate>
      </PercentContextProvider>
    </Provider>
  );
}

export default App;
