/// <reference path="../node_modules/firebase/firebase.d.ts" />
/// <reference path="../node_modules/definitely-typed-angular/angular.d.ts" />
import { config } from './config';

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
  title: string = "cool";
  usersRef: firebase.database.Reference;
  newUser : IUser | null;

  constructor($scope: ng.IScope) {
    this.usersRef = firebase.database().ref("users");
    this.usersRef.once('value', (snapshot) => {
      $scope.$apply(() => {
        this.getData(snapshot);
      });
    });
    this.usersRef.on('value', (snapshot) => {
      this.getData(snapshot);
    });
  }

  private getData(snapshot: firebase.database.DataSnapshot | null) {
    if (snapshot) {
      this.users = [];
      let temp = snapshot.val();
      for (var key in temp) {
        let user: IUser = temp[key];
        user.ref = key;
        this.users.push(temp[key]);
      }
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

  public add(user :IUser){
    if(!this.newUser) return;
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

//try to do a regular import than webpack in the future





// function writeUserData(userId: string, name: string, email: string, imageUrl: string) {
//   firebase.database().ref('users/' + userId).update({
//     username: name,
//     email: email,
//     profile_picture: imageUrl
//   });
// }



// writeUserData("sally", "Sally Mae", "sally@sally.com", "https://images/sally.jpg");

// app.database().ref('users/sally').on('value', (snapshot) => {
//   if (snapshot) {
//     var el = document.getElementById('sally');
//     if (el) {
//       let p = <IPerson>snapshot.val();
//       let name = snapshot.key;
//       el.innerText = `Name: ${p.username} Id: ${name} Email ${p.email}`;
//     }
//   }
// });

//console.log('userId: ' + ).push().key);
let dogKey = app.database().ref().child("dogs").push().key;

// for (var x = 0; x < 1000; x++) {
//   firebase.database().ref('dogs').push({
//     name: 'spot',
//     breed: 'mutt'
//   }).then(() => {
//     console.log('dog added');
//   });
// }






//  firebase.database().ref('dogs').remove();

