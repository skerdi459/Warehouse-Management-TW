import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Order, OrderStatus, Item, User } from '../../../core/models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../../core/auth/service/token-storage.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-edit-order-dialog',
  standalone: true,
  template: `
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">{{ viewModeTitle }}</h2>

    <!-- Order Information (view mode) -->
    <div *ngIf="view" class="mb-4 space-y-2">
      <div><strong>Order Number:</strong> {{ order?.orderNumber }}</div>
      <div><strong>Submitted Date:</strong> {{ order?.submittedDate | date: 'yyyy-MM-dd' }}</div>
      <div><strong>User:</strong> {{ order?.user?.username }}</div>
      <div *ngIf="order?.declineReason"><strong>Decline Reason:</strong> {{ order?.declineReason }}</div>

    </div>

    <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <!-- Order Status -->
      <div class="p-field">
        <label class="block mb-2">Status</label>
        <p-dropdown [options]="statusOptions" formControlName="status" placeholder="Select Status" [disabled]="true"></p-dropdown>
      </div>

      <!-- Deadline Date -->
      <div class="p-field">
        <label class="block mb-2">Deadline Date</label>
        <p-calendar formControlName="deadlineDate" dateFormat="yy-mm-dd" [disabled]="view" tabindex="2" [appendTo]="'body'"[minDate]="todayDate" ></p-calendar>
      </div>

      <!-- Items Form Array -->
      <div formArrayName="items" class="space-y-4">
        <div *ngFor="let item of items.controls; let i = index" [formGroupName]="i" class="border p-4 rounded">
          <div class="flex gap-4 justify-around">
            <!-- Item Selection -->
            <div>
              <label class="block mb-2">Item</label>
              <p-dropdown [options]="allItems" formControlName="item" optionLabel="itemName" placeholder="Select Item"
                          [disabled]="view" [showClear]="true">
                <ng-template let-item pTemplate="item">
                  <div>{{ item.itemName }} ({{ item.quantity }} available)</div>
                </ng-template>
              </p-dropdown>
            </div>

            <!-- Quantity -->
            <div class="w-32">
              <label class="block mb-2">Quantity</label>
              <p-inputNumber formControlName="quantity" [min]="1" [max]="getMaxQuantity(i)" [disabled]="view"></p-inputNumber>
              <div *ngIf="items.controls[i].get('quantity')?.hasError('max')">Quantity cannot exceed {{ getMaxQuantity(i) }}.</div>

            </div>

            <!-- Remove Item Button -->
            <button *ngIf="!view" pButton type="button" icon="pi pi-trash" class="p-button-danger mt-6"
                    (click)="removeItem(i)"></button>
          </div>
        </div>
      </div>

      <!-- Add Item Button (hidden in view mode) -->
      <button *ngIf="!view" pButton type="button" icon="pi pi-plus" label="Add Item" class="p-button-secondary"
              (click)="addItem()"></button>

      <!-- Form Actions -->
      <div class="flex justify-end gap-2 mt-6">
        <button pButton type="button" label="Cancel" class="p-button-outlined" (click)="dialogRef.close()"></button>
        <button *ngIf="!view" pButton type="submit" label="Save" [disabled]="orderForm.invalid" class="p-button-success"></button>
      </div>
    </form>
  </div>
  `,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputNumberModule,
    DropdownModule,
    CalendarModule
  ]
})
export class AddEditOrderDialogComponent implements OnInit {
  orderForm!: FormGroup;
  order: Order | undefined;
  allItems: Item[] = [];
  statusOptions = Object.values(OrderStatus);
  edit = false;
  view = false;
  todayDate: Date;

  constructor(
    private fb: FormBuilder,
    private userAuth: TokenStorageService,
    private orderService: OrderService,
    public config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    private cdr: ChangeDetectorRef
  ) {
    this.todayDate = new Date();

    this.initializeForm();
    this.configureMode();
    if (this.order) {
      this.patchForm(this.order);
    }
  }

  get viewModeTitle(): string {
    return this.view ? 'View Order' : (this.edit ? 'Edit Order' : 'Create Order');
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  ngOnInit() {
    this.loadItems();
  }

  private initializeForm() {
    this.orderForm = this.fb.group({
      status: [{ value: OrderStatus.CREATED, disabled: true }, Validators.required],
      deadlineDate: [null, Validators.required],
      items: this.fb.array([])
    });
  }

  private configureMode() {
    const { mode, order } = this.config.data || {};
    this.view = mode === 'view';
    this.edit = mode === 'edit';
    this.order = order;
    if (this.view) {
      this.orderForm.disable();
    }
  }

  private loadItems() {
    this.orderService.findAllItems().subscribe({
      next: (items) => (this.allItems = items)
    });
  }

  addItem() {
    this.items.push(this.createItemGroup());
  }

  removeItem(index: number) {
    this.items.removeAt(index);
  }

  private createItemGroup(): FormGroup {
    const group = this.fb.group({
      item: [null, Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });
    group.get('item')?.valueChanges.subscribe((selectedItem: any) => {
      const maxQuantity = selectedItem ? selectedItem.quantity : 1;

      group.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(maxQuantity),
      ]);

      group.get('quantity')?.updateValueAndValidity({ onlySelf: true, emitEvent: false });

    });
    return group;

  }

  getMaxQuantity(index: number): number {
    const selectedItem = this.items.at(index).get('item')?.value;
    return selectedItem ? selectedItem.quantity : 0;
  }

  private patchForm(order: Order) {
    this.orderForm.patchValue({
      status: order.status,
      deadlineDate: order.deadlineDate ? new Date(order.deadlineDate) : null
    });

    order.orderItems.forEach((item) => {
      this.items.push(this.fb.group({
        item: [item.item, Validators.required],
        quantity: [item.quantity, [Validators.required, Validators.min(1)]]
      }));
    });

    if (this.view) {
      this.orderForm.disable();
    }
  }

  onSubmit() {
    if (this.orderForm.invalid) return;

    const formValue = this.orderForm.value;
    const order: Order = {
      ...(this.config.data?.order || {}),
      status: formValue.status,
      deadlineDate: formValue.deadlineDate,
      user: this.userAuth.getUser(),
      orderItems: formValue.items.map((item: any) => ({
        item: item.item,
        quantity: item.quantity
      }))
    };

    const action$ = this.edit ? this.orderService.update(order) : this.orderService.save(order);
    action$.subscribe((response) => this.dialogRef.close(response));
  }
}
