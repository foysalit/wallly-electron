// @flow
import React, { Component } from 'react';
import type { Children } from 'react';


export default class App extends Component {
  props: {
    children: Children
  };

  state = { visible: false };
  
  toggleVisibility () {
    this.setState({ visible: !this.state.visible })
  };

  render() {
    return (
      <div>
          {this.props.children}
      </div>
    );
  }
}
