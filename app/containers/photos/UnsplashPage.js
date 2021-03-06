// @flow
import React, { Component } from 'react';
import { Grid } from 'semantic-ui-react';

import List from '../../components/photos/List';
import Photos from '../../utils/photos';

const api = new Photos();

export default class UnsplashPage extends Component {
  state = {photos: [], isLoading: true};

  loadPhotos () {
    this.setState({isLoading: true});
    api.getPhotos().then(photos => {
      this.setState({photos, isLoading: false});
    });
  };

  componentDidMount() {
    this.loadPhotos();
  };

  render() {
    const { photos } = this.state;

    return (
      <Grid columns={2} style={{ padding: '2%' }}>
        <Grid.Column width={10}>
          <List 
          	photos={photos}
          	loadMore={this.loadPhotos.bind(this)}
          	isLoading={this.state.isLoading}/>
        </Grid.Column>
      </Grid>
    );
  }
}
