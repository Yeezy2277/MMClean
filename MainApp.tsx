import React from 'react';
import {Provider} from 'react-redux';
import store from './src/store/store';
import App from './App';

const MainApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default MainApp;
