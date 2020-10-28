import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { SharedModule } from '@shared/shared.module';
import { MaterialModule } from '@material/material.module';
import { DashboardComponent } from './dashboard.component';
import { ContactsMainComponent } from './contacts-main/contacts-main.component';
import { ContactDialogComponent } from './contact-dialog/contact-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    ContactsMainComponent,
    ContactDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule
  ],
  entryComponents: [
    ContactDialogComponent
  ],
  providers: []
})
export class DashboardModule {
}
