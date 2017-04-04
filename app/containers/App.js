// @flow
import React, { Component } from 'react';
import type { Children } from 'react';

import Nav from '../components/Nav';

export default class App extends Component {
  props: {
    children: Children
  };

  render() {
    return (
      <div>
        <Nav />
        {this.props.children}
      </div>
    );
  }
}
