import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { Usuarios } from './interfaces/usuarios.interface';
import { FirebaseauthService } from './services/firebaseauth.service';
import { FirestoreService } from './services/firestore.service';
import { InteractionService } from './services/interaction.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  registro: Usuarios = {
    email: '',
    password: '',
    uid: '',
  };

  uid = '';

  suscriberUserInfo: Subscription;

  admin = false;

  constructor(
    private interaction: InteractionService,
    public firebaseauthService: FirebaseauthService,
    public firestoreService: FirestoreService,
    private platform: Platform,
    public router: Router
  ) {
    this.initializeApp();
    this.firebaseauthService.stateAuth().subscribe((res) => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
      } else {
        this.initRegistro();
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getUid();
    });
  }

  initRegistro() {
    this.uid = '';
    this.registro = {
      email: '',
      password: '',
      uid: '',
    };
    console.log(this.registro);
  }

  getUserInfo(uid: string) {
    console.log('getUserInfo');
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService
      .getDoc<Usuarios>(path, this.uid)
      .subscribe((res) => {
        this.registro = res;
      });
  }

  getUid() {
    this.firebaseauthService.stateAuth().subscribe((res) => {
      if (res !== null) {
        if (res.uid === 'Wg81Mn8G2vgxADLFQMjzsAsCgKD3') {
          console.log('Bienvenido Administrador');
          this.router.navigate(['/home']);
          this.admin = true;
        } else {
          console.log('Bienvenido');
          this.router.navigate(['/home']);
          this.admin = false;
        }
      } else {
        this.admin = false;
      }
    });
  }
}
