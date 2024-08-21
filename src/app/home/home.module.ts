import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module'; // Assurez-vous d'importer le module de routage

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule // Assurez-vous d'importer le module de routage pour la page d'accueil
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
