import { context } from 'bookingbug-core-js';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import { createBrowserHistory } from "history";
import React from 'react';
// Alert provider
import { positions, Provider as AlertProvider, transitions } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import ReactDOM from 'react-dom';
import { HashRouter, Redirect, Route, Router, Switch } from "react-router-dom";
import configData from '../src/config.json';
import Footer from './Components/Footer/Footer';
import Header from './Components/Header/Header';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import AccountPage from './Views/AccountPage.js';
// pages for this product
import LoginPage from "./Views/LoginPage/LoginPage.js";
import './assets/css/loading-icon.css';

var history = createBrowserHistory();

// optional configuration
const options = {
  // you can also just use 'bottom center'
  position: positions.TOP_CENTER,
  timeout: 0,
  offset: '30px',
  // you can also just use 'scale'
  transition: transitions.SCALE
}

// BB Context storage
context.apiUrl = configData.apiServer.api_url;
context.apiVersion = configData.apiServer.version;

// storage event to modify localStorage
window.addEventListener('storage', (event) => {
  if (event.storageArea === localStorage) {
    let token = localStorage.getItem('token_name');
  }
})

ReactDOM.render(
  <AlertProvider template={AlertTemplate} {...options}>
    <Router history={history}>
      <Header />
      <Switch>
        <HashRouter>
          <Route exact path="/" component={LoginPage} >
            <Redirect to="/login" />
          </Route>
          <Route path="/login" component={LoginPage} />
          <Route path='/account-page' component={AccountPage} />
        </HashRouter>
      </Switch>
      <Footer />
    </Router>
  </AlertProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
