import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Truck } from '../../../core/models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TrucksService } from './trucks.service';

@Component({
  selector: 'app-edit-truck-dialog',
  standalone: true,
  template: `
  <div class="dialog-container max-h-96 overflow-y-auto">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold">{{ isEditMode ? 'Edit Truck' : 'Add Truck' }}</h2>
      <button pButton type="button" icon="pi pi-times" (click)="closeDialog()"
              class="p-button-text p-button-rounded p-button-plain hover:bg-gray-100">
      </button>
    </div>
    <form [formGroup]="truckForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div *ngFor="let field of formFields" class="p-field">
        <label [for]="field.name" class="block text-sm font-medium text-gray-700">
          {{ field.label }}
        </label>
        <input [id]="field.name" pInputText [formControlName]="field.name" type="text" 
               class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-300 focus:outline-none"
               [ngClass]="{'border-red-500': isFieldInvalid(field.name)}"/>
      </div>

      <div class="flex justify-end gap-2">
        <button pButton type="submit" label="Save" [disabled]="truckForm.invalid"
                class="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
        </button>
      </div>
    </form>
  </div>
  `,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule
  ]
})
export class AddEditTruckDialogComponent implements OnInit {

  truckForm: FormGroup;
  truck: Truck | null = null;
  isEditMode = false;

  formFields = [
    { name: 'chassisNumber', label: 'Chassis Number *' },
    { name: 'plate', label: 'License Plate *' },
    { name: 'driverName', label: 'Driver Name' }
  ];

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private dialogRef: DynamicDialogRef,
    private truckService: TrucksService
  ) {
    this.truckForm = this.createTruckForm();
  }


  ngOnInit(): void {
    this.truck = this.config.data?.truck || null;
    this.isEditMode = !!this.truck;
    if (this.isEditMode) {
      this.patchFormValues(this.truck!);
    }
  }


  public onSubmit(): void {
    if (this.truckForm.invalid) return;

    const payload = { ...this.truck, ...this.truckForm.value };
    const operation = this.isEditMode ?
      this.truckService.update(payload.id, payload) :
      this.truckService.save(payload);

    operation.subscribe((truck: Truck) => this.dialogRef.close(truck));
  }

  public isFieldInvalid(fieldName: string): boolean {
    const control = this.truckForm.get(fieldName);
    return !!(control?.invalid && control?.touched);
  }
  public closeDialog(): void {
    this.dialogRef.close();
  }
  private createTruckForm(): FormGroup {
    return this.fb.group({
      chassisNumber: ['', Validators.required],
      plate: ['', Validators.required],
      driverName: ['']
    });
  }

  private patchFormValues(truck: Truck): void {
    this.truckForm.patchValue(truck);
  }


}
