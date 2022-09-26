/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable max-len */
import { Datos } from './../interfaces/datos.interface';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { InteractionService } from '../services/interaction.service';
import { FirestoreService } from '../services/firestore.service';
import { DataService } from '../services/data.service';
import { FirebaseauthService } from '../services/firebaseauth.service';
import { Usuarios } from '../interfaces/usuarios.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Admin } from '../interfaces/Admin.interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  guia: Datos[] = [];
  diario: Datos[] = [];
  semanal: Datos[] = [];
  quincenal1: Datos[] = [];
  quincenal2: Datos[] = [];
  mensual: Datos[] = [];
  semestral1: Datos[] = [];
  semestral2: Datos[] = [];
  anual: Datos[] = [];

  nuevo: Datos = {
    ID: '',
    NOMBRES: '',
    APELLIDOS: '',
    CORREO: '',
    CELULAR: null,
    CEDULA: null,
    DIRECCION: '',
    TOTAL: '',
    FECHA: '',
    HORA: '',
    DIA: null,
    MES: null,
    AÑO: null,
    SEMESTRE: null,
    QUINCENA: null
  };

  usuarios: Usuarios[] = [];

  registro: Usuarios = {
    email: '',
    password: '',
    uid: '',
  };

  uid = '';

  suscriberUserInfo: Subscription;

  enableNuevo = false;

  admin = false;

  informe = 'Diario';

  public selectedSegment: string='Diario';

  public selectedSegmentqui1: string='1';
  public selectedSegmentsem1: string='1';
  public selectedSegmentqui2: string='1';
  public selectedSegmentsem2: string='1';
  public selectedSegmentdia: string='1';
  public selectedSegmentwee: string='1';
  public selectedSegmentmen: string='1';
  public selectedSegmentanu: string='1';

  constructor(
    public firestoreService: FirestoreService,
    private interaction: InteractionService,
    public alertController: AlertController,
    public firebaseauthService: FirebaseauthService,
    private data: DataService,
    private router: Router
  ) {
    this.firebaseauthService.stateAuth().subscribe((res) => {
      if (res !== null) {
        this.uid = res.uid;
        this.getUserInfo(this.uid);
        if (this.uid === 'Wg81Mn8G2vgxADLFQMjzsAsCgKD3') {
          this.admin = true;
        }
      } else {
        this.initRegistro();
      }
    });
  }

  ngOnInit() {
    this.Todos();
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
      .subscribe(async (res) => {
        this.registro = res;
        const uid = await this.firebaseauthService.getUid();
        if (uid === 'Wg81Mn8G2vgxADLFQMjzsAsCgKD3') {
          this.admin = true;
        }
      });
  }

  Todos(){
    const path = 'Datos';
    const dateObj = new Date();
    const dia = dateObj.getUTCDate();
    console.log(dia);
    const day = dateObj.getUTCDate() - 1;
    console.log(day);
    const mes = dateObj.getUTCMonth() + 1;
    const año = dateObj.getUTCFullYear();
    const diasem = dateObj.getUTCDay();
    const diasemi = dia-diasem;
    this.firestoreService.getCollectionUnic<Datos>(path, 'DIA', dia).subscribe( res => {
      this.diario = res;
    });
    this.firestoreService.getCollectionUnic<Datos>(path, 'DIA', diasemi).subscribe( res => {
      this.semanal = res;
    });
    if(dia>15){
      this.firestoreService.getCollectionUnic<Datos>(path, 'QUINCENA', 2).subscribe( res => {
        this.quincenal2 = res;
      });
    }else{
      this.firestoreService.getCollectionUnic<Datos>(path, 'QUINCENA', 1).subscribe( res => {
        this.quincenal1 = res;
      });
    }
    this.firestoreService.getCollectionUnic<Datos>(path, 'MES', mes).subscribe( res => {
      this.mensual = res;
    });
    if(mes>6){
      this.firestoreService.getCollectionUnic<Datos>(path, 'SEMESTRE', 2).subscribe( res => {
        this.semestral2 = res;
      });
    }else{
      this.firestoreService.getCollectionUnic<Datos>(path, 'SEMESTRE', 1).subscribe( res => {
        this.semestral1 = res;
      });
    }
    this.firestoreService.getCollectionUnic<Datos>(path, 'AÑO', año).subscribe( res => {
      this.anual = res;
    });
  }

  segmentChanged(event: any){
    console.log(event.target.value);
    this.selectedSegment=event.target.value;
  }

  Quincenal1(event: any){
    console.log(event.target.value);
    this.selectedSegmentqui1=event.target.value;
  }

  Quincenal2(event: any){
    console.log(event.target.value);
    this.selectedSegmentqui2=event.target.value;
  }

  Semestral1(event: any){
     console.log(event.target.value);
     this.selectedSegmentsem1=event.target.value;
  }

  Semestral2(event: any){
     console.log(event.target.value);
     this.selectedSegmentsem2=event.target.value;
  }

  Diario(event: any){
    this.selectedSegmentdia=event.target.value;
  }

  Semanal(event: any){
    this.selectedSegmentwee=event.target.value;
  }

  Mensual(event: any){
    this.selectedSegmentmen=event.target.value;
  }

  Anual(event: any){
    this.selectedSegmentanu=event.target.value;
  }

  async Salir() {
    this.interaction.presentLoading('Cerrando Sesion...');
    this.firebaseauthService.logout();
    this.suscriberUserInfo.unsubscribe();
    this.interaction.closeLoading();
    this.router.navigate(['/usulog']);
    this.interaction.presentToast('Cerró sesion con exito');
  }

  excelExportDia() {
    this.data.exportAsExcelFile(this.diario, 'Diario');
  }

  excelExportSem() {
    this.data.exportAsExcelFile(this.semanal, 'Semanal');
  }

  excelExportQuin1() {
    this.data.exportAsExcelFile(this.quincenal1, 'Quincena1');
  }

  excelExportQuin2() {
    this.data.exportAsExcelFile(this.quincenal2, 'Quincena2');
  }

  excelExportMes() {
    this.data.exportAsExcelFile(this.mensual, 'Mensual');
  }

  excelExportSeme1() {
    this.data.exportAsExcelFile(this.semestral1, 'Semestral1');
  }

  excelExportSeme2() {
    this.data.exportAsExcelFile(this.semestral2, 'Semestral2');
  }

  excelExportAno() {
    this.data.exportAsExcelFile(this.anual, 'Anual');
  }

  async guardarDato() {
    const cedula = String(this.nuevo.CEDULA);
    const celular = String(this.nuevo.CELULAR);
    const dateObj = new Date();
    const dia = dateObj.getUTCDate();
    const mes = dateObj.getUTCMonth() + 1;
    const año = dateObj.getUTCFullYear();
    this.nuevo.DIA = dia;
    this.nuevo.MES = mes;
    this.nuevo.AÑO = año;
    this.nuevo.SEMESTRE = mes>6 ? 2: 1;
    this.nuevo.QUINCENA = dia>15 ? 2: 1;
    if (this.nuevo.ID === ''){
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el ID');
    } else if (this.nuevo.NOMBRES === '') {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar los nombres');
    } else if (this.nuevo.APELLIDOS === '') {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar los apellidos');
    } else if (this.nuevo.CORREO === '') {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el correo');
    } else if (this.nuevo.CELULAR === null || cedula.length > 10) {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el celular correctamente');
    } else if (this.nuevo.CEDULA === null || celular.length > 10) {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar la cedula correctamente');
    } else if (this.nuevo.DIRECCION === '') {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar la direccion correctamente');
    } else if (this.nuevo.TOTAL === '') {
      this.interaction.closeLoading();
      this.interaction.presentToast('Debe digitar el total');
    } else {
      this.interaction.presentLoading('Subiendo Pago...');
      this.firestoreService
        .createDoc(this.nuevo, 'Datos', this.nuevo.ID)
        .then((res) => {
          console.log('Subido con exito', res);
          this.interaction.closeLoading();
          this.interaction.presentToast('Subido con exito');
        })
        .catch((error) => {
          this.interaction.closeLoading();
          this.interaction.presentToast('A ocurrido un Error');
          console.log('ERROR', error);
        });
      this.enableNuevo = false;
    }
  }
  if(arg0: boolean) {
    throw new Error('Method not implemented.');
  }

  deleteDatos(nuevos: Datos) {
    this.interaction.presentLoading('Borrando Noticia...');
    this.firestoreService.deleteDoc('Datos', nuevos.ID).then((res) => {
      this.interaction.closeLoading();
      this.interaction.presentToast('Borrada con exito');
    });
  }

  async nueva() {
    // const id = this.firestoreService.getId();
    this.enableNuevo = true;
    const dateObj = new Date();
    const DIA = dateObj.getUTCDate();
    const MES = dateObj.getUTCMonth() + 1;
    const AÑO = dateObj.getUTCFullYear();
    this.nuevo = {
      ID: '',
      NOMBRES: '',
      APELLIDOS: '',
      CORREO: '',
      CELULAR: null,
      CEDULA: null,
      DIRECCION: '',
      TOTAL: '',
      FECHA: new Date().toLocaleDateString('es-GB'),
      HORA: new Date().toLocaleTimeString('en-US'),
      DIA,
      MES,
      AÑO,
      SEMESTRE: MES>6 ? 2: 1,
      QUINCENA: DIA>15 ? 2: 1,
    };
  }

  Buscar() {
    if (this.informe === 'Diario') {
      this.firestoreService
        .getCollectionTodos<Datos>('Datos')
        .subscribe((res) => {
          this.diario = res;
        });
    }
  }
}
