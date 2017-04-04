// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import UnsplashPage from './containers/photos/UnsplashPage';
import SavedPage from './containers/photos/SavedPage';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="unsplash" component={UnsplashPage} />    
    <Route path="saved" component={SavedPage} />    
  </Route>
);
