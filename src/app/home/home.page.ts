import { Datos } from './../interfaces/datos.interface';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InteractionService } from '../services/interaction.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  datos: Datos[] = [];
  nuevo: Datos = {
    id: '',
    nombres: '',
    apellidos: '',
    correo: '',
    celular: null,
    cedula: null,
    direccion: '',
    total: '',
    tiempo: undefined,
    fecha: '',
    hora: ''
  };

  enableNuevo = false;

  private path = 'Datos';

  constructor(
    public firestoreService: FirestoreService,
    private interaction: InteractionService,
    public alertController: AlertController,
  ) {}

  ngOnInit() {
    this.getDatosRecientes();
  }

  async guardarDato(){
    const cedula = String(this.nuevo.cedula);
    const celular = String(this.nuevo.celular);
    if(this.nuevo.id === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el ID');
    }else if(this.nuevo.nombres === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar los nombres');
    }else if(this.nuevo.apellidos === ''){
        this.interaction.closeLoading();
        this.interaction.presentToast('Debe digitar los apellidos');
    }else if(this.nuevo.correo === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el correo');
    }else if(this.nuevo.celular === null || cedula.length > 10){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el celular corectamente');
    }else if(this.nuevo.cedula === null || celular.length > 10){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar la cedula correctamente');
    }else if(this.nuevo.direccion === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar la direccion correctamente');
    }else if(this.nuevo.total === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el total');
    }else{
      this.interaction.presentLoading('Subiendo Pago...');
      this.firestoreService.createDoc(this.nuevo, this.path, this.nuevo.id).then( res => {
        console.log('Subido con exito', res);
        this.interaction.closeLoading();
        this.interaction.presentToast('Subido con exito');
      }).catch( error => {
        this.interaction.closeLoading();
        this.interaction.presentToast('A ocurrido un Error');
        console.log('ERROR', error);
      });
      this.enableNuevo = false;
    };
  }

  deleteDatos(nuevos: Datos){
    this.interaction.presentLoading('Borrando Noticia...');
    this.firestoreService.deleteDoc(this.path, nuevos.id).then(res=>{
      this.interaction.closeLoading();
      this.interaction.presentToast('Borrada con exito');
    });
  }

  async getDatosRecientes(){
    this.firestoreService.getCollectionTodos<Datos>(this.path).subscribe(res => {
      this.datos = res;
    });
  }

  async nueva(){
    // const id = this.firestoreService.getId();
    this.enableNuevo = true;
    this.nuevo = {
      id: '',
      nombres: '',
      apellidos: '',
      correo: '',
      celular: null,
      cedula: null,
      direccion: '',
      total: '',
      tiempo: new Date(),
      fecha: new Date().toLocaleDateString('es-GB'),
      hora: new Date().toLocaleTimeString('en-US'),
    };
  }
}
