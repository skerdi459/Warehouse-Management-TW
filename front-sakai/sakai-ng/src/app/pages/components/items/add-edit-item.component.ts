import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Item } from '../../../core/models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-edit-item-dialog',
  standalone: true,
  template: `
    <div class="dialog-container max-h-96 overflow-y-auto">
      <h2 class="text-2xl font-bold mb-6">{{ isEdit ? 'Edit Item' : 'Add Item' }}</h2>

      <form [formGroup]="itemForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div class="p-field">
          <label for="itemName" class="block text-sm font-medium text-gray-700">Item Name</label>
          <input id="itemName" pInputText formControlName="itemName" type="text" 
                 class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none" />
        </div>

        <div class="p-field">
          <label for="quantity" class="block text-sm font-medium text-gray-700">Quantity</label>
          <p-inputNumber id="quantity" formControlName="quantity" mode="decimal" [min]="0"
                         class="w-full border border-gray-300 rounded-lg focus:ring focus:ring-green-300 focus:outline-none"></p-inputNumber>
        </div>

        <div class="p-field">
          <label for="unitPrice" class="block text-sm font-medium text-gray-700">Unit Price</label>
          <p-inputNumber id="unitPrice" formControlName="unitPrice" mode="currency" currency="USD" [min]="0"
                         class="w-full border border-gray-300 rounded-lg focus:ring focus:ring-green-300 focus:outline-none"></p-inputNumber>
        </div>

        <div class="flex justify-end space-x-2">
          <button pButton type="button" label="Cancel" class="p-button-outlined" (click)="onCancel()"></button>
          <button pButton type="submit" label="Save" [disabled]="itemForm.invalid"
                  class="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
          </button>
        </div>
      </form>
    </div>
  `,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule
  ]
})
export class AddEditItemDialogComponent implements OnInit {
  item: Item | null = null;
  itemForm: FormGroup;
  isEdit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    private itemsService: ItemsService
  ) {
    this.itemForm = this.fb.group({
      itemName: ['', Validators.required],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.item = this.config.data.item ?? null;
    this.isEdit = !!this.item;
    
    if (this.isEdit) {
      this.itemForm.patchValue(this.item as Item);
    }
  }

  public onSubmit(): void {
    if (this.itemForm.invalid) return;

    const formValue = this.itemForm.getRawValue();
    const saveOperation = this.isEdit
      ? this.itemsService.update(this.item!.id, { ...this.item, ...formValue })
      : this.itemsService.save(formValue);

    saveOperation.subscribe((savedItem) => {
      this.dialogRef.close(savedItem);
    });
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
