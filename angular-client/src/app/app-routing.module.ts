import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PhaserioComponent } from './components/phaserio/phaserio.component';
import { BabylonjsComponent } from './components/babylonjs/babylonjs.component';
import { ThreejsComponent } from './components/threejs/threejs.component';
import { ApiComponent } from './components/api/api.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'phaserio', component: PhaserioComponent },
  { path: 'babylonjs', component: BabylonjsComponent },
  { path: 'threejs', component: ThreejsComponent },
  { path: 'api', component: ApiComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
