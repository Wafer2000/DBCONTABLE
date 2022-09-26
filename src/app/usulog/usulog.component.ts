/* eslint-disable @typescript-eslint/no-shadow */
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { InteractionService } from 'src/app/services/interaction.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { MenuController } from '@ionic/angular';
import { format, parseISO } from 'date-fns';
import { Usuarios } from '../interfaces/usuarios.interface';
import { FirebaseauthService } from '../services/firebaseauth.service';
import { Admin } from '../interfaces/Admin.interface';

@Component({
  selector: 'app-usulog',
  templateUrl: './usulog.component.html',
  styleUrls: ['./usulog.component.scss'],
})
export class UsulogComponent implements OnInit {

  mostrar = true;

  usuarios: Usuarios[] = [];

  registro: Usuarios = {
    email: '',
    password: '',
    uid: ''
  };

  newImage = '';

  newFile: any;

  uid = '';

  suscriberUserInfo: Subscription;

  ingresarEnable = true;

  passEnable = true;

  admin = false;

  constructor(
    public menucontroller: MenuController,
    private firestoreService: FirestoreService,
    public firebaseauthService: FirebaseauthService,
    private interaction: InteractionService,
    public router: Router
    ) {
      this.firebaseauthService.stateAuth().subscribe( res => {
        if (res !== null){
          this.uid = res.uid;
          this.getUserInfo(this.uid);
        } else {
        }
      });
    }

  formatDate(value: string) {
    return format(parseISO(value), 'dd/MM/yyyy');
  }

  ngOnInit() {}

  getUserInfo(uid: string){
    console.log('getUserInfo');
    const path = 'Usuarios';
    this.suscriberUserInfo = this.firestoreService.getDoc<Usuarios>(path, this.uid).subscribe(async res =>{
      this.registro = res;
      const uid = await this.firebaseauthService.getUid();
      if(uid==='Wg81Mn8G2vgxADLFQMjzsAsCgKD3'){
        this.admin = true;
      };
    });
  }

  async ingresar(){
    const credenciales = {
      email: this.registro.email,
      password: this.registro.password,
    };
    console.log(credenciales);
    if(this.registro.email === ''){
      this.interaction.presentToast('Digite el Correo Electronico');
    }else if(this.registro.password === ''){
      this.interaction.presentToast('Digite la Contraseña');
    }else{
      this.interaction.presentLoading('Iniciando Sesion...');
      const res = await this.firebaseauthService.login(credenciales.email, credenciales.password).then( res => {
        console.log('Ingresó con exito');
        console.log(res);
        this.interaction.closeLoading();
        this.interaction.presentToast('Inició sesion con exito');
        this.router.navigate(['/home']);
      }).catch( error => {
        this.interaction.closeLoading();
        this.interaction.presentToast('Digite la Cuenta y Contraseña de manera correcta');
        console.log('ERROR', error);
      });
    }

  }

}
