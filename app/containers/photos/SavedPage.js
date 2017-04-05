// @flow
import React, { Component } from 'react';
import { Message, Grid, Segment, Form, Button } from 'semantic-ui-react';

import List from '../../components/photos/List';
import Photos from '../../utils/photos';

export default class SavedPage extends Component {
  api = new Photos();
  state = {photos: []};

  loadPhotos () {
    this.setState({isLoading: true});
    this.api.getLocal().then(photos => {
      this.setState({photos});
    });
  };

  componentDidMount() {
    this.loadPhotos();
  };

  render() {
    const { photos } = this.state;
    const localDir = this.api.localDir;

    return (
      <div style={{ padding: '2%' }}>
        {(photos.length > 0) ? (
          <Grid columns={2}>
            <Grid.Column width={10}>
              <h1>pictures  Page</h1>
              <h3>subtitle</h3>
              <List 
                photos={photos}
                loadMore={this.loadPhotos.bind(this)}
                noLoader={true}/>
            </Grid.Column>

            <Grid.Column width={6}>
              <Segment>
                <Form>
                  <Form.Field>
                    <label>Local Photos Directory</label>
                    <input value={localDir} disabled="true" />
                  </Form.Field>
                  <Form.Field>
                    <Button 
                      onClick={this.api.cleanLocal.bind(this.api)}
                      color="red" 
                      icon="remove"
                      content="Clear"/>

                    <Button 
                      onClick={this.api.showLocalFolder.bind(this.api)}
                      icon="folder"
                      content="Show Folder"/>
                  </Form.Field>
                </Form>
              </Segment>
            </Grid.Column>
          </Grid>
        ) : (
          <Message
            icon='warning'
            header='No Saved Wallpapers'
            content='There doesnt seem to be any saved wallpapers. Please go to the Unsplashed page and save images from there.'/>
        )}
      </div>
    );
  }
}
