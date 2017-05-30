/// <reference path="../node_modules/firebase/firebase.d.ts" />
/// <reference path="../node_modules/definitely-typed-angular/angular.d.ts" />
import { config } from './config';

//todo: 
// Try to use the new async await in ts.

angular.module('app', []);

//Manual bootstrap angular app 
(<any>(angular.element(document))).ready(() => {
  angular.bootstrap(document.body, ['app']);
});

interface IUser {
  username: string;
  email: string;
  profile_picture: string,
  ref: string;
}

let app = firebase.initializeApp(config);

class AppCtrl {
  users: any[];
  dogs: any[]
  title: string = "cool";
  usersRef: firebase.database.Reference;
  newUser: IUser | null;

  constructor($scope: ng.IScope) {
    this.usersRef = firebase.database().ref("users");
    this.getDogs();
    this.usersRef.once('value', (snapshot) => {
      $scope.$apply(() => {
        this.getData(snapshot);
      });
    });
    this.usersRef.on('value', (snapshot) => {
      this.getData(snapshot);
    });
  }

  private getDogs() {
    if (this.usersRef.parent == null) return;
    let dogRef = this.usersRef.parent.child('dogs').orderByChild('breed');
    this.dogs = []
    dogRef.once('value', (sn) => {
      sn.forEach((dog) => {
        this.dogs.push(dog.val());
        return false;
      });
    });
  }

  private addDogs() {
    if (this.usersRef.parent == null) return;
    let dogRef = this.usersRef.parent.child('dogs');
    // dogRef.push({
    //   breed: 'rat terrier',
    //   name: 'peeky'
    // }, (err) => {
    //   console.log(err);
    // });
    // dogRef.push({
    //   breed: 'pug',
    //   name: 'fitzy'
    // });
    dogRef.push({
      breed: 'poodle',
      name: 'angel'
    });
  }

  private getData(snapshot: firebase.database.DataSnapshot | null) {
    if (snapshot) {
      this.users = [];
      snapshot.forEach((a)=>{
          let user =<IUser> a.val();
          user.ref = a.key || '';
          this.users.push(user);
          return false;
      });
    }
  }

  public save(user: IUser) {
    let temp = <IUser>{
      email: user.email,
      username: user.username,
      profile_picture: user.profile_picture
    }
    this.usersRef.child(user.ref).update(temp);
  }

  public add(user: IUser) {
    if (!this.newUser) return;
    let temp = <IUser>{
      email: this.newUser.email,
      username: this.newUser.username,
      profile_picture: this.newUser.profile_picture
    }
    this.usersRef.child(this.newUser.username).set(temp);
    this.newUser = null;
  }

  public delete(user: IUser) {
    this.usersRef.child(user.ref).remove();
  }
}

angular.module('app').controller('AppCtrl', AppCtrl);


