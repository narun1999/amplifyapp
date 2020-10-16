import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import { Provider } from 'react-redux'
import { createStore/*, applyMiddleware*/ } from 'redux';
import Reducer from './Components/App/reducer'
// import logger from 'redux-logger'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage/session'
import { PersistGate } from 'redux-persist/integration/react'

import * as serviceWorker from './serviceWorker';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, Reducer)
const store = createStore(persistedReducer/*, applyMiddleware(logger)*/)
const persistor = persistStore(store)


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
