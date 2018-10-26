import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'; 
import Router from './router'
import {Provider} from 'react-redux'
import store from './redux/store/configureStore' 
import {unregister} from './registerServiceWorker'; 

// const store = configureStore();
ReactDOM.render(
    <Provider store={store}>
        <Router />
    </Provider>, document.getElementById('root')); 
unregister();
 
