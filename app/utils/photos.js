import Unsplash, { toJson } from "unsplash-js";
import storage from 'electron-storage';
import electron from 'electron';
import request from 'request';
import wallpaper from 'wallpaper';
import { createWriteStream } from 'fs-jetpack';
import { map, extend } from 'lodash';

export default class Photos {
  constructor() {
    this.currentPage = 0;
    this.perPage = 20;
    this.localDataFile = 'photos';

    this.localDir = (electron.app || electron.remote.app).getPath('userData');

    if (this.api)
      return;

    this.api = new Unsplash({

    });
  };

  getLocal () {
    return storage.get(this.localDataFile).then(photos => {
      console.log('got photos from local');
      return photos;
    }).catch(err => {
      console.log('error getting local photos', err);
      return null;
    });
  };

  setLocal (fromApi) {
    return storage.set(this.localDataFile, fromApi).then(data => {
      console.log('saved on local', fromApi);
      return fromApi;
    }).catch(err => {
        console.log('error saving on local');
        return console.error(err);
    });
  };

  getPhotos () {
    return this.getLocal()
      .then(fromLocal => {
        if (fromLocal)
          return fromLocal;

        console.log('getting from api');
        return this.api.photos.listPhotos(this.currentPage, this.perPage, 'latest')
          .then(toJson)
          .then((fromApi) => this.setLocal(fromApi));
      });
  };

  createPhotoName (photo) {
    return `${this.localDir}/${photo.id}.jpg`;
  };

  savePhotoFile (photo) {
    return new Promise((resolve, reject) => {
      if (photo.saved)
        return resolve(photo);

      request(photo.links.download)
        .pipe(createWriteStream(this.createPhotoName(photo)))
        .on('close', () => {
          this.updatePhoto(extend({saved: true}, photo)).then((newPhoto) => resolve(newPhoto));
        })
        .on('error', reject);
    });
  };

  updatePhoto (photo) {
    return this.getLocal()
      .then(photos => {
        return map(photos, (e) => {
          if (e.id !== photo.id)
            return e;

          return extend({}, photo, e);
        });
      })
      .then((updated) => this.setLocal(updated))
      .then(() => photo);
  };

  setWallpaper (photo) {
    return this.savePhotoFile(photo)
      .then(() => wallpaper.set(this.createPhotoName(photo)))
      .catch(err => {
        console.error('error saving photo', err);
      });
  }
}