import React from 'react';
import AlertContextProvider from './alertContext';
import SettingsContextProvider from './settingsContext';
import { Provider } from 'react-redux';
import { PrinterProvider } from './printerContext';
import store from '../redux/store';
import MenuContextProvider from './menuContext';
import OrderContextProvider from './orderContext';


const AppContexts = ({ children }) => (
  <MenuContextProvider>
    <AlertContextProvider>
      <SettingsContextProvider>
        <OrderContextProvider>
          <Provider store={store}>
            <PrinterProvider>
              {children}
          </PrinterProvider>
        </Provider>
        </OrderContextProvider>
      </SettingsContextProvider>
    </AlertContextProvider>
  </MenuContextProvider>
);

export default AppContexts;
