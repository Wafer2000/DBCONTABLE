import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsulogComponent } from './usulog.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [
    UsulogComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
  ]
})
export class UsulogModule { }
