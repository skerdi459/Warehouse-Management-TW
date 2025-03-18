
export interface User {
    id: number;
    username: string;
    password: string;
    email: string;
    roles: Role[];
  }


  export interface ColumnTable {
    header: string;
    field: string;
  }

  export interface Truck {
    id: number;
    chassisNumber: string;
    plate: string;
    freeSpace:number;
    driverName?: string;
    lifeCycle: LifeCycle;
}

  export interface Item {
    id: number;
    itemName: string;
    quantity: number;
    unitPrice: number;
    lifeCycle: LifeCycle;
  }

  export interface Schedule {
    id: number|undefined;
    deliveryDate: Date;
    status: DeliveryStatus;
    trucks: Truck[];
    orders: Order[];
    itemCount: number;
  }
  


export interface ScheduleRequest {
  deliveryDate: Date;
  status: DeliveryStatus;
      itemCount:number
     trucks: Truck[];
     orderIds:string[]
    }

  export enum OrderStatus {
    CREATED = 'CREATED',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    APPROVED = 'APPROVED',
    DECLINED = 'DECLINED',
    UNDER_DELIVERY = 'UNDER_DELIVERY',
    FULFILLED = 'FULFILLED',
    CANCELED = 'CANCELED'
  }

  export enum DeliveryStatus {
    SCHEDULED = 'SCHEDULED',
    DELIVERED = 'DELIVERED',
  }

  export interface OrderItem {
    id: number;
    item: Item;
    quantity: number;
  }

  export interface Order {
    id: number;
    orderNumber:string;
    submittedDate: Date;
    status: OrderStatus;
    deadlineDate?: Date;
    user: User;
    orderItems: OrderItem[];
    declineReason?: string; 
    orderQuantity:number
  }
  

  export interface Page<T> {
    totalElements: number;
    content: T[];         
    totalItems: number;      
    totalPages: number;      
    page: number;           
    size: number;        
  }


  export interface commonFilter{
    filters:any;
    page:number;
    size:number;
    sortOrder:any
}


  export enum Role {
    CLIENT = 'CLIENT',
    WAREHOUSE_MANAGER = 'WAREHOUSE_MANAGER',
    SYSTEM_ADMIN = 'SYSTEM_ADMIN'
  }

  export enum LifeCycle {
    READY = 'READY',
    IN_PROGRESS = 'IN_PROGRESS',
    COMPLETED = 'COMPLETED'
  }

