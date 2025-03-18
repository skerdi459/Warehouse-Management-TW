import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ColumnTable, Item, Role, commonFilter } from '../../../core/models/models';
import { DeleteDialogService } from '../../../core/common/deleteDialog.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { ItemsService } from './items.service';
import { AddEditItemDialogComponent } from './add-edit-item.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'items',
  templateUrl: './item.component.html',
  standalone:false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MessageService],
})
export class ItemsComponent implements OnInit {
  items: Item[] = [];
  cols: ColumnTable[] = [];
  totalElements: number = 0;
  UserRole=Role;

  constructor(
    private deleteDialogService: DeleteDialogService,
    private cdr: ChangeDetectorRef,
    private messageService: MessageService,
    private itemsService: ItemsService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.initializeColumns();
  }

  private initializeColumns(): void {
    this.cols = [
      { header: 'Name', field: 'itemName' },
      { header: 'Quantity', field: 'quantity' },
      { header: 'Price', field: 'unitPrice' },
    ];
  }

  public onAddItem(): void {
    this.openEditDialog(null);
  }

  public onEditItem(item: Item): void {
    this.openEditDialog(item);
  }

  public onDeleteItem(item: Item): void {
    const confirmMessage = `Are you sure you want to delete ${item.itemName}?`;

    this.deleteDialogService.openDeleteConfirmation(confirmMessage, () => {
      this.itemsService.softDelete(item.id).subscribe({
        next: () => {
          this.removeItemFromList(item);
          this.showMessage('success', 'Item Deleted', `${item.itemName} has been successfully deleted.`);
          this.cdr.detectChanges();
        }
      });
    });
  }

  private removeItemFromList(item: Item): void {
    const index = this.items.findIndex((el) => el.id === item.id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.totalElements--;
    }
  }

  public loadItems(event: TableLazyLoadEvent): void {
    const commonFilter: commonFilter = {
      filters: event.filters || {},
      size: event.rows || 10,
      page: event.first ? event.first / 10 : 1,
      sortOrder: event.sortOrder || 1,
    };

    this.itemsService.getItemPaginated(commonFilter).subscribe({
      next: (data:any) => {
        this.totalElements = data.totalElements;
        this.items = data.content;
        this.cdr.detectChanges();
      }
    });
  }

  private openEditDialog(item: Item | null): void {
    const dialogRef: DynamicDialogRef = this.dialogService.open(AddEditItemDialogComponent, {
      width: '40rem',
      data: { item },
      contentStyle: { 'max-height': '80vh', overflow: 'hidden' },
    });

    dialogRef.onClose.subscribe((updatedItem: Item) => {
      if (updatedItem) {
        this.handleDialogClose(item, updatedItem);
      }
    });
  }

  private handleDialogClose(item: Item | null, updatedItem: Item): void {
    if (item) {
      this.updateItemInList(item, updatedItem);
    } else {
      this.addItemToList(updatedItem);
    }
    this.cdr.detectChanges();
  }

  private updateItemInList(item: Item, updatedItem: Item): void {
    const index = this.items.findIndex((u) => u.id === item.id);
    if (index > -1) {
      this.items[index] = updatedItem;
    }
    this.showMessage('success', 'Item Updated', `${updatedItem.itemName} has been successfully updated.`);
  }

  private addItemToList(updatedItem: Item): void {
    this.items.push({ ...updatedItem});
    this.totalElements++;
    this.showMessage('success', 'Item Added', `${updatedItem.itemName} has been successfully added.`);
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
