import React, { Component } from 'react';
import moment from 'moment';
import { Card, Image, Icon, Button } from 'semantic-ui-react';

import Photos from '../../utils/photos';

export default class SinglePhoto extends Component {
  constructor(props) {
    super(props);
    this.api = new Photos();
    this.state = {isSaving: false};
  };

  savePhoto (photo) {
    if (this.state.isSaving)
      return;

    this.setState({isSaving: true});
    this.api.savePhotoFile(photo).then((done) => this.setState({isSaving: false}));
  };

  removePhoto (photo) {
    if (this.state.isSaving)
      return;

    this.api.removePhoto(photo);
  };

  setWallpaper (photo) {
    if (this.state.isSaving)
      return;

    this.setState({isSaving: true});
    this.api.setWallpaper(photo).then((done) => this.setState({isSaving: false}));
  };

  render () {
    const { photo } = this.props;
    return (
      <Card fluid>
        <Image src={ photo.saved ? this.api.createPhotoName(photo) : photo.urls.regular } />
        <Card.Content>
          <Card.Header>
            { photo.user.name }
          </Card.Header>
          <Card.Meta>
            <span className='date'>
              { moment(photo.created_at).fromNow() }
            </span>
          </Card.Meta>
          <Card.Description>
            { photo.user.bio }
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <a>
            <Icon name='heart' />
            { photo.likes } Likes
          </a>

          <Button.Group floated='right' size="mini" basic>
            {photo.saved ? (
              <Button color="teal">
                <Icon name="download"/> Saved
              </Button>
            ) : (
              <Button 
                onClick={this.savePhoto.bind(this, photo)} 
                icon={this.state.isSaving ? '' : 'download'}
                content={this.state.isSaving ? 'Saving..' : 'Save'}
                loading={this.state.isSaving}>
              </Button>
            )}
            <Button
                onClick={this.setWallpaper.bind(this, photo)} 
                icon={this.state.isSaving ? '' : 'picture'}
                content={this.state.isSaving ? '' : 'Use'}
                loading={this.state.isSaving}></Button>
            
            {photo.saved && <Button onClick={this.removePhoto.bind(this, photo)}>Remove</Button>}
          </Button.Group>
        </Card.Content>
      </Card>
    );
  };
};