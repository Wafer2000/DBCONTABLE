import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { UsulogComponent } from './usulog/usulog.component';

const routes: Routes = [
  { path: 'home', loadChildren: () => import('./home/home.module').then((m) => m.HomePageModule)},
  { path: 'usulog', component: UsulogComponent },
  { path: '', component: UsulogComponent,},
  { path: '**', redirectTo: 'usulog', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
