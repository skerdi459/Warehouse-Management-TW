import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ColumnTable, Order, OrderStatus, Role, commonFilter } from "../../../core/models/models";
import { TableLazyLoadEvent } from "primeng/table";
import { DeleteDialogService } from "../../../core/common/deleteDialog.service";
import { AddEditOrderDialogComponent } from "./add-edit-order-dialog.component";
import { OrderService } from "./order.service";
import { TokenStorageService } from "../../../core/auth/service/token-storage.service";
import { MessageService } from "primeng/api";

@Component({
  selector: 'orders',
  standalone: false,
  templateUrl: './order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MessageService],
})
export class OrdersComponent implements OnInit, OnChanges {
  @Input() checkBoxMode = false;
  @Input() preFilter: string | undefined;
  @Input() selectedOrders: Order[] = [];
  @Output() selectedOrdersChange = new EventEmitter<Order[]>();

  orderToDecline: Order | undefined;
  selectedStatus: string = '';
  statuses = [
    { label: 'Created', value: 'CREATED' },
    { label: 'Awaiting Approval', value: 'AWAITING_APPROVAL' },
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Declined', value: 'DECLINED' },
    { label: 'Under Delivery', value: 'UNDER_DELIVERY' },
    { label: 'Fulfilled', value: 'FULFILLED' },
    { label: 'Canceled', value: 'CANCELED' }
  ];

  orders: Order[] = [];
  cols: ColumnTable[] = [];
  totalElements: number = 0;
  displayDeclineDialog: boolean = false;
  declineReason: string = '';
  UserRole = Role;
  dialogRef: DynamicDialogRef | null = null; 

  constructor(
    private confirmationService: DeleteDialogService,
    private cdr: ChangeDetectorRef,
    private orderService: OrderService,
    private tokenService: TokenStorageService,
    private dialogService: DialogService,
    private messageService: MessageService
  ) { }


  get user() {
    return this.tokenService.getUser();
  }

  ngOnInit(): void {
    this.cols = [
      { header: "Order Number", field: "orderNumber" },
      { header: "Create Date", field: "submittedDate" },
      { header: "Status", field: "status" }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.loadOrders()
  }

  ngOnDestroy(): void {
    if (this.dialogRef) {
      this.dialogRef.close();  
    }
  }

  public loadOrders($event?: TableLazyLoadEvent): void {
    const commonFilter: commonFilter = {
      filters: this.buildFilters($event?.filters || {}),
      size: $event?.rows || 10,
      page: $event?.first ? ($event.first / 10) : 0,
      sortOrder: $event?.sortOrder || 1,
    };

    this.orderService.getItemPaginated(commonFilter).subscribe((data: any) => {
      this.totalElements = data.totalElements;
      this.orders = data.content;
      this.cdr.detectChanges();
    });
  }



  public submitOrder(order: Order): void {
    this.confirmationService.openDeleteConfirmation(
      `Are you sure you want to submit ${order.id}?`,
      () => {
        this.orderService.submitOrder(order.id).subscribe((updatedOrder) => {
          this.updateOrderStatus(updatedOrder, OrderStatus.AWAITING_APPROVAL);
        });
      }
    );
  }


  public viewSpecific(order: Order): void {
    this.openEditDialog(order, 'view');
  }

  public showDeclineDialog(order: Order): void {
    this.orderToDecline = order;
    this.displayDeclineDialog = true;
  }

  public submitDeclineReason(): void {
    if (this.orderToDecline && this.declineReason) {
      this.orderService.declineOrder(this.orderToDecline.id, this.declineReason).subscribe((updatedOrder) => {
        this.displayDeclineDialog = false;
        this.declineReason = '';
        this.updateOrderStatus(updatedOrder, OrderStatus.DECLINED);
        this.displayDeclineDialog = false
      });
    }
  }

  public cancelDecline(): void {
    this.displayDeclineDialog = false;
    this.declineReason = '';
  }

  public approvedOrder(order: Order): void {
    this.confirmationService.openDeleteConfirmation(
      `Are you sure you want to approve ${order.id}?`,
      () => {
        this.orderService.approveOrder(order.id).subscribe((updatedOrder) => {
          this.updateOrders(updatedOrder, order, 'edit');
        });
      }
    );
  }

  public cancelOrder(order: Order): void {
    this.confirmationService.openDeleteConfirmation(
      `Are you sure you want to cancel ${order.orderNumber}?`,
      () => {
        this.orderService.cancelOrder(order.id).subscribe((updatedOrder) => {
          this.updateOrders(updatedOrder, order, 'edit');
        });
      })
  }

  public emitOrders(): void {
    this.selectedOrdersChange.emit(this.selectedOrders);
  }

  public canCreateOrder(): boolean {
    return this.user?.roles.includes(Role.CLIENT) ?? false;
  }

  public canEdit(order: Order): boolean {
    return (this.user?.roles.includes(Role.CLIENT) &&
      [OrderStatus.CREATED, OrderStatus.DECLINED].includes(order.status)) ?? false;
  }

  public canCancel(order: Order): boolean {
    const forbiddenStatuses = [OrderStatus.FULFILLED, OrderStatus.UNDER_DELIVERY, OrderStatus.CANCELED];
    return (this.user?.roles.includes(Role.CLIENT) &&
      !forbiddenStatuses.includes(order.status)) ?? false;
  }

  public canSubmit(order: Order): boolean {
    return (this.user?.roles.includes(Role.CLIENT) &&
      [OrderStatus.CREATED, OrderStatus.DECLINED].includes(order.status)) ?? false;
  }

  public canApproveDecline(order: Order): boolean {
    return (this.user?.roles.includes(Role.WAREHOUSE_MANAGER) &&
      order.status === OrderStatus.AWAITING_APPROVAL) ?? false;
  }

  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  private updateOrderStatus(order: Order, status: OrderStatus): void {
    const index = this.orders.findIndex(el => el.id === order.id);
    if (index > -1) {
      this.orders[index] = order;
      this.cdr.detectChanges();
    }
    this.showMessage('success', 'Order Updated status', `${status} has been successfully updated.`);

  }
  public openEditDialog(order: Order | null, mode: 'view' | 'edit' | 'create'): void {
    this.dialogRef = this.dialogService.open(AddEditOrderDialogComponent, {
      width: '40rem',
      data: { order, mode },
      contentStyle: { 'max-height': '80vh', 'overflow': 'scroll' }
    });

    this.dialogRef.onClose.subscribe((updatedItem: Order) => {
      if (updatedItem && mode !== 'view') {
        this.updateOrders(updatedItem, order, mode);
      }
      this.cdr.detectChanges();
    });
  }

  private updateOrders(updatedItem: Order, order: Order | null, mode: 'edit' | 'create'): void {
    if (order) {
      this.showMessage('success', 'Order Updated', `${updatedItem.orderNumber} has been successfully added.`);
      const index = this.orders.findIndex((u) => u.id === order.id);
      if (index > -1) {
        this.orders[index] = updatedItem;
      }
    } else {
      this.orders.unshift({ ...updatedItem });
      this.totalElements++;
    }
    this.cdr.detectChanges()
  }

  private buildFilters(filters: any): any {
    const filterObject: any = {};

    Object.keys(filters).forEach((key) => {
      filterObject[key] = filters[key].value;
    });

    if (this.preFilter) {
      filterObject["date"] = this.preFilter;
      filterObject["status"] = OrderStatus.APPROVED;
    }

    if (this.user?.roles[0] === Role.CLIENT) {
      filterObject["user"] = this.user.username;
    }

    return filterObject;
  }
}
