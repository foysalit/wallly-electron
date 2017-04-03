// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Card } from 'semantic-ui-react';

import styles from './Home.css';
import SinglePhoto from './photo';
import Photos from '../utils/photos';

export default class Home extends Component {
  api = new Photos();
  state = {photos: []};

  componentDidMount() {
    this.api.getPhotos().then(photos => {
      this.setState({photos});
    });
  };

  render() {
    const { photos } = this.state;

    return (
      <div className={styles.container} data-tid="container">
        {photos.length > 0 && photos.map(photo => (
          <SinglePhoto photo={photo} key={photo.id} />
        ))}
      </div>
    );
  }
}
