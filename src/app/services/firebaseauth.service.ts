import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseauthService {

  constructor(
    public auth: AngularFireAuth,
    public fires: AngularFirestore,
    public storage: AngularFireStorage
    ) {
    this.getUid();
  }


  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  async getUid(){
    const user = await this.auth.currentUser;
    if (user === null){
      return null;
    } else{
      return user.uid;
    }
  }

  stateAuth(){
    return this.auth.authState;
  }

}
