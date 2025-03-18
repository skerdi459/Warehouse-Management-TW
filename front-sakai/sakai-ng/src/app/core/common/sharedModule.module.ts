import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table'; 
import { BadgeModule } from 'primeng/badge'; 
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog'; 
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GetPipeModule } from '../pipes/get.pipe';
import { DeleteDialogService } from './deleteDialog.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SelectModule } from 'primeng/select';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { HasRoleDirective } from '../auth/role-directive.directive';

@NgModule({
    imports: [
    CommonModule,
    TableModule,
    ToastModule,
    BadgeModule,
    ButtonModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    GetPipeModule,
    SelectButtonModule,
    DropdownModule,
    DialogModule,  
    FormsModule,
    HasRoleDirective,
    SelectModule
],
exports: [
    CommonModule,
    TableModule,
    BadgeModule,
    ButtonModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    ReactiveFormsModule,
    ToastModule,
    GetPipeModule,
    SelectButtonModule,
    DropdownModule,
    DialogModule, 
    FormsModule,
    HasRoleDirective,
    SelectModule
],
    providers: [DeleteDialogService,ConfirmationService,MessageService],

  })
  export class SharedCommonModule {}
