import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ColumnTable, Order, Schedule, ScheduleRequest, Truck } from '../../../core/models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { OrdersModule } from '../orders/order.module';
import { SplitterModule } from 'primeng/splitter';
import { AccordionModule } from 'primeng/accordion';
import { TurcksModule } from '../trucks/truck.module';
import { ScheduleService } from './schedule.service';
import { GetPipeModule } from "../../../core/pipes/get.pipe";

@Component({
  selector: 'app-edit-schedule-dialog',
  standalone: true,
  template: `
    <div class="dialog-container h-[50vh] w-full p-4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">{{ schedule ? 'View Schedule' : 'Add Schedule' }}</h2>
        <button pButton type="button" icon="pi pi-times" (click)="closeDialog()"
                class="p-button-text p-button-rounded p-button-plain hover:bg-gray-100">
        </button>
      </div>

      <form [formGroup]="scheduleForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <label for="deliveryDate" class="block text-sm font-medium text-gray-700">Delivery Date *</label>
        <p-calendar id="deliveryDate" formControlName="deliveryDate" dateFormat="yy-mm-dd"
                    [disabledDays]="[0]"
                    class="w-full p-2 focus:ring focus:ring-blue-300 focus:outline-none"
                    [ngClass]="{'border-red-500': scheduleForm.get('deliveryDate')?.invalid && scheduleForm.get('deliveryDate')?.touched}">
        </p-calendar>

        <!-- Order Button (Disabled until date is chosen) -->
        <div class="flex justify-between items-center">
          <label for="order" class="block text-sm font-medium text-gray-700">Order *</label>
          <button *ngIf="access != 'view'" type="button" [disabled]="formattedDate == null || access === 'view'"
                  (click)="toggleOrderPanel()" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            {{ showOrderPanel ? 'Hide Orders' : 'Show Orders' }}
          </button>
        </div>

        <!-- Order Panel -->
        <div *ngIf="showOrderPanel" class="mt-2 border w-full">
          <div class="overflow-hidden">
            <orders [checkBoxMode]="true" [preFilter]="formattedDate" [(selectedOrders)]="selectedOrder"
                    (selectedOrdersChange)="handleEmitOrders($event)" class="w-full" >
            </orders>
          </div>
        </div>

        <!-- Accordion for selected orders -->
        <i class="pi pi-box mr-2"></i>Selected Orders {{selectedOrder.length}}

        <p-accordion *ngIf="selectedOrder && selectedOrder.length > 0">
        
        <p-accordionTab header="Selected Orders">
  
            <div class="table-responsive">
            <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th *ngFor="let col of colsOrder" class="p-2 text-left">{{ col.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of selectedOrder" class="border-b">
            <td *ngFor="let col of colsOrder" class="p-2">
            <span>{{ order | get: col.field }}</span>
            </td>
          </tr>
        </tbody>
      </table>
            </div>
          </p-accordionTab>
        </p-accordion>

        <div class="flex justify-between items-center">
          <label for="truck" class="block text-sm font-medium text-gray-700">Truck *</label>
          <button *ngIf="access != 'view' " type="button" [disabled]="selectedOrder?.length === 0 || access === 'view'"
                  (click)="toggleTruckPanel()" class="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
            {{ showTrackPanel ? 'Hide Trucks' : 'Show Trucks' }}
          </button>
        </div>

        <div *ngIf="showTrackPanel" class="mt-2 border w-full">
          <div class="overflow-hidden">
            <truck [checkBoxMode]="true" [preFilter]="true" [selectedTrucks]="selectedTrucks" (selectedTruckChange)="handleEmitTrucks($event)">
            </truck>
          </div>
        </div>
        <i class="pi pi-truck mr-2"></i>Selected Truck {{selectedTrucks.length}}
  
        <p-accordion *ngIf="selectedTrucks.length > 0">
        
          <p-accordionTab header="Selected Trucks">
            <div class="table-responsive">
            <table class="w-full border-collapse">
        <thead>
          <tr class="border-b">
            <th *ngFor="let col of cols" class="p-2 text-left">{{ col.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let order of selectedTrucks" class="border-b">
            <td *ngFor="let col of cols" class="p-2">
            <span>{{ order | get: col.field }}</span>
            </td>
          </tr>
        </tbody>
      </table>
              
            </div>
          </p-accordionTab>
        </p-accordion>

        <!-- Submit Button -->
        <div *ngIf="access !='view'" class="flex justify-end gap-2">
          <button pButton type="submit" label="Save" [disabled]="isFormOK()"
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
    OrdersModule,
    TurcksModule,
    MultiSelectModule,
    SplitterModule,
    CalendarModule,
    AccordionModule,
    GetPipeModule
  ]
})
export class AddEditScheduleDialogComponent implements OnInit {

  selectedTrucks: Truck[] = [];
  formattedDate: string | undefined;
  totallOrderedItems: number = 0;
  schedule: Schedule | null = null;
  scheduleForm: FormGroup;
  edit: boolean = false;
  orderOptions: Order[] = [];
  public selectedOrder: Order[] = [];
  showOrderPanel: boolean = false;
  showTrackPanel: boolean = false;
  access: string = '';
  cols: ColumnTable[] = [];
  colsOrder: ColumnTable[] = [];
  todayDate: Date;

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private cdr: ChangeDetectorRef,
    private scheduleService: ScheduleService,
    private dialogRef: DynamicDialogRef
  ) {
    this.todayDate = new Date();

    this.access = this.config.data?.access ?? '';

    this.scheduleForm = this.fb.group({
      deliveryDate: [null, [Validators.required]],
    });

    this.scheduleForm.get('deliveryDate')?.valueChanges.subscribe(date => {
      this.formattedDate = this.formatDate(date);
    });
  }

  ngOnInit(): void {
    if (this.config.data?.schedule) {
      this.schedule = this.config.data.schedule;
      this.edit = true;
      if (this.schedule) {
        this.patchFormValues(this.schedule);
        if (this.access === 'view') {
          this.scheduleForm.disable();
        }
      }
    }

   this.initCols()
  }

  public handleEmitOrders(orders: Order[]): void {
    this.selectedOrder = orders;
    this.totallOrderedItems = orders.reduce((sum, ord) => sum + ord.orderQuantity, 0);
    this.toggleOrderPanel();
  }

  public handleEmitTrucks(trucks: Truck[]): void {
    this.selectedTrucks = trucks;
    this.toggleTruckPanel();
  }

  public onSubmit():void {
    if (this.scheduleForm.valid) {
      const selectedTrucks: Truck[] = this.selectedTrucks;
      const selectedOrderIds: any[] = this.selectedOrder?.map((order: Order) => order.id) ?? [];
      const totalItems = this.selectedOrder?.reduce((total, order: Order) => {
        return total + (order.orderQuantity || 0);
      }, 0);

      const scheduleRequest: ScheduleRequest = {
        deliveryDate: this.scheduleForm.get('deliveryDate')?.value,
        status: this.scheduleForm.get('status')?.value,
        itemCount: totalItems,
        trucks: selectedTrucks,
        orderIds: selectedOrderIds
      };

      this.scheduleService.save(scheduleRequest).subscribe((response: Schedule) => {
        this.dialogRef.close(response);
      });
    }
  }

  public toggleOrderPanel():void {
    this.showOrderPanel = !this.showOrderPanel;
  }

  public toggleTruckPanel():void {
    this.showTrackPanel = !this.showTrackPanel;
  }

  public closeDialog():void {
    this.dialogRef.close();
  }

  public isFormOK(): boolean {
    return !this.scheduleForm.valid || this.totallOrderedItems === 0;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private patchFormValues(schedule: Schedule): void {
    
    this.scheduleForm.patchValue({
      deliveryDate: schedule.deliveryDate ? new Date(schedule.deliveryDate) : null
    });
    this.selectedOrder = schedule?.orders || [];
    this.selectedTrucks = schedule.trucks || [];
  }
  private initCols():void {
    this.cols = [{
      header: "Driver Name",
      field: "driverName",
    },
    {
      header: "Chassis Number",
      field: "chassisNumber",
    },
    {
      header: "Available",
      field: "available",
    },
    ]

    this.colsOrder = [{
      header: "Order Number",
      field: "orderNumber",
    },
    {
      header: "Order status",
      field: "status",
    },
    {
      header: "orderQuantity",
      field: "orderQuantity",
    },
    ]  }
}
