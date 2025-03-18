import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnTable, Role, Truck, commonFilter } from '../../../core/models/models';
import { DeleteDialogService } from '../../../core/common/deleteDialog.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { TrucksService } from './trucks.service';
import { AddEditTruckDialogComponent } from './add-edit-trucks.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'truck',
  standalone: false,
  templateUrl: './truck.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MessageService],
})
export class TrucksComponent {

  @Input() checkBoxMode = false;
  @Input() preFilter = false;
  @Input() selectedTrucks: Truck[] = [];
  @Output() selectedTruckChange = new EventEmitter<Truck[]>();
  trucks: Truck[] = [];
  cols: ColumnTable[] = [];
  totalElements: number = 0;
  UserRole = Role;
  dialogRef: DynamicDialogRef | null = null; 

  constructor(
    private deleteDialogService: DeleteDialogService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private truckService: TrucksService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initializeColumns();
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();  
    }
  }

  private initializeColumns(): void {
    this.cols = [
      { header: "Plate", field: "plate" },
      { header: "Chassis Number", field: "chassisNumber" },
      { header: "Driver Name", field: "driverName" }
    ];
  }

  public emitSelectedTrucks(): void {
    this.selectedTruckChange.emit(this.selectedTrucks);
  }

  public onAddTruck(): void {
    this.openTruckDialog(null);
  }

  public onEditTruck(truck: Truck): void {
    this.openTruckDialog(truck);
  }

  public onDeleteTruck(truck: Truck): void {
    this.deleteDialogService.openDeleteConfirmation(
      `Are you sure you want to delete ${truck.chassisNumber}?`,
      () => {
        this.truckService.softDelete(truck.id).subscribe(() => {
          this.removeTruckFromList(truck);
        });
      }
    );
  }

  public loadTrucks(event: TableLazyLoadEvent): void {
    const commonFilter: commonFilter = {
      filters: this.buildFilters(event.filters || {}),
      size: event.rows || 10,
      page: event.first ? event.first / 10 : 0,
      sortOrder: event.sortOrder || 1,
    };

    this.truckService.getItemPaginated(commonFilter).subscribe((data: any) => {
      this.trucks = data.content;
      this.totalElements = data.totalElements;
      this.cdr.detectChanges();
    });
  }

  private buildFilters(filters: any): any {
    const filterObject: any = {};
  
    if (this.preFilter) {
      filterObject["freeSpace"] = true
    }
    return filterObject
  }

  private removeTruckFromList(truck: Truck): void {
    const truckIndex = this.trucks.findIndex((el) => el.id === truck.id);
    if (truckIndex > -1) {
      this.trucks.splice(truckIndex, 1);
      this.totalElements--;
      this.cdr.detectChanges();
      this.showToast('Truck deleted');
    }
  }

  private openTruckDialog(truck: Truck | null): void {
    this.dialogRef = this.dialogService.open(AddEditTruckDialogComponent, {
      width: '40rem',
      data: { truck },
      contentStyle: { 'max-height': '80vh', 'overflow': 'hidden' }
    });

    this.dialogRef.onClose.subscribe((updatedTruck: Truck) => {
      if (updatedTruck) {
        truck ? this.updateTruckInList(truck, updatedTruck) : this.addNewTruck(updatedTruck);
      }
      this.cdr.detectChanges();
    });
  }

  private updateTruckInList(truck: Truck, updatedTruck: Truck): void {
    const index = this.trucks.findIndex((t) => t.id === truck.id);
    if (index > -1) {
      this.trucks[index] = updatedTruck;
      this.showToast('Truck updated');
    }
  }

  private addNewTruck(newTruck: Truck): void {
    this.trucks.push({ ...newTruck });
    this.totalElements++;
    this.showToast('Truck added');
  }

  private showToast(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: message,
      detail: 'Operation completed successfully',
    });
  }
}
