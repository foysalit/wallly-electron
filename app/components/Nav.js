import React, { Component } from 'react';
import type { Children } from 'react';
import { Link } from 'react-router';
import { Menu, Input } from 'semantic-ui-react';

import styles from './Nav.css';

export default class Nav extends Component {
  render() {
      return (
        <div className={styles.container}>
          <Menu pointing>
            <Menu.Item link>
              <Link to="/saved" activeClassName="active">Saved</Link>
            </Menu.Item>
            <Menu.Item link>
              <Link to="/unsplash" activeClassName="active">Unsplash</Link>
            </Menu.Item>
            <Menu.Menu position='right'>
              <Menu.Item>
                <Input icon='search' placeholder='Search...' />
              </Menu.Item>
            </Menu.Menu>
          </Menu>
        </div>
    );
  }
}
