// @flow
import React, { Component } from 'react';
import { Link } from 'react-router';
import { Card, Button } from 'semantic-ui-react';

import styles from './Photos.css';
import SinglePhoto from './Single';
import Photos from '../../utils/photos';

export default class List extends Component {

  render() {
    const { photos, loadMore, isLoading, noLoader } = this.props;
    return (
      <div className={styles.container} data-tid="container">
        {photos.length > 0 && photos.map(photo => (
          <SinglePhoto photo={photo} key={photo.id} />
        ))}
        
        {!noLoader && 
          <Button
            fluid
            onClick={loadMore}
            loading={isLoading}
            content="Load More" />
        }
      </div>
    );
  }
}
