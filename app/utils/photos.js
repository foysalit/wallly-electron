import Unsplash, { toJson } from "unsplash-js";
import storage from 'electron-storage';
import electron, { shell } from 'electron';
import request from 'request';
import wallpaper from 'wallpaper';
import { createWriteStream, remove } from 'fs-jetpack';
import { map, extend } from 'lodash';

export default class Photos {
  currentPage = 0;
  perPage = 20;
  localDataFile = 'photos';
  loaded = [];

  constructor() {
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
    return this.api.photos.listPhotos(this.currentPage, this.perPage, 'latest')
      .then(toJson)
      .then((fromApi) => {
        this.currentPage = this.currentPage+this.perPage;
        this.loaded = this.loaded.concat(fromApi);
        return this.loaded;
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
        let found = false;
        const updated = map(photos, (e) => {
          if (e.id !== photo.id)
            return e;

          found = true;
          return extend({}, photo, e);
        });

        if (!found) {
          photos.push(photo);
          return photos;
        }

        return updated;
      })
      .then((updated) => this.setLocal(updated))
      .then(() => photo);
  };

  setWallpaper (photo) {
    return this.savePhotoFile(photo)
      .then(() => wallpaper.set(this.createPhotoName(photo)))
      .then(() => this.updatePhoto(extend({wallpaper: true}, photo)))
      .catch(err => {
        console.error('error saving photo', err);
      });
  };

  cleanLocal () {
    return this.getLocal().then((photos) => {
      photos.forEach(p => {
        remove(this.createPhotoName(p));
      });

      return photos;
    }).then(() => this.setLocal([]));
  };

  showLocalFolder () {
    return shell.showItemInFolder(`${this.localDir}/Preferences`);
  };

  removePhoto (photo) {
    return this.getLocal().then((photos) => {
      const newPhotos = photos.filter(p => {
        if (p.id !== photo.id)
          return true;

        if (p.wallpaper) 
          return true;

        remove(this.createPhotoName(p));
        return false;
      });

      return this.setLocal(newPhotos);
    });
  };
}