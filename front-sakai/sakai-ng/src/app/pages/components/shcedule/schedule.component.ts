import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ColumnTable, Schedule, commonFilter } from '../../../core/models/models';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { AddEditScheduleDialogComponent } from './add-view-schedule.component';
import { ScheduleService } from './schedule.service';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'items',
  standalone: false,
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService,MessageService],

})
export class ScheduleComponent implements OnInit,OnDestroy{

  schedule: Schedule[] = [];
  cols: ColumnTable[] = [];
  totalElements: number = 0;
  dialogRef: DynamicDialogRef | null = null; 

  constructor(private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private scheduleService: ScheduleService,
    private dialogService: DialogService) { }


  ngOnInit(): void {
   this.initCols()
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();  
    }
  }

  public onAddItem():void {
    this.openEditDialog(null, 'edit');
  }


  public loadUsers($event: TableLazyLoadEvent):void {
    const commonFilter: commonFilter = {
      filters: $event.filters || {},
      size: $event.rows || 10,
      page: $event.first ? $event.first / 10 : 0,
      sortOrder: $event.sortOrder || 1,
    };


    this.scheduleService.search(commonFilter).subscribe((data: any) => {

      this.totalElements = data.totalElements

      this.schedule = data.content
      this.cdr.detectChanges()
    })

  }


  public viewSchedule(schedule: any): void {
    this.openEditDialog(schedule, 'view')
  }

  private initCols() {
    this.cols = [{
      header: "Delivery Date",
      field: "deliveryDate",
    },
    {
      header: "Status",
      field: "status",
    },
    {
      header: "Orders Number",
      field: "orders",
    }
    ]  
  }

  private openEditDialog(schedule: Schedule | null, acces: string) {
    this.dialogRef= this.dialogService.open(AddEditScheduleDialogComponent, {
      width: '86vh',
      data: { schedule, access: acces },
      contentStyle: {
        'width': "81vh",
        'height': '80vh',
        'overflow': 'hidden'
      }
    });

    this.dialogRef.onClose.subscribe((updatedItem: Schedule) => {
      if (updatedItem) {
        if (schedule) {
          const index = this.schedule.findIndex((u) => u.id === schedule.id);
          if (index > -1) {
            this.schedule[index] = updatedItem;
          }
        } else {
          this.schedule.push({ ...updatedItem });
          this.totalElements++
        }
        this.showMessage('success', 'Item Added', `${updatedItem.id} has been successfully added.`);
      }

      this.cdr.detectChanges()

    });
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

}
