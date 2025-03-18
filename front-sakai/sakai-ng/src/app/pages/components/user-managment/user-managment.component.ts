import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ColumnTable, Role, User, commonFilter } from '../../../core/models/models';
import { DeleteDialogService } from '../../../core/common/deleteDialog.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddEditUserDialogComponent } from './add-edit-user.component';
import { UserManagmentService } from './user-managment.service';
import { TableLazyLoadEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { TokenStorageService } from '../../../core/auth/service/token-storage.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, MessageService],
})
export class UserManagmentComponent {
  users: User[] = [];
  cols: ColumnTable[] = [];
  totalElements: number = 0;
  UserRole = Role;

  get loginUser(): User | null {
    return this.tokenStorage.getUser()
  }

  constructor(
    private confirmationService: DeleteDialogService,
    private cdr: ChangeDetectorRef,
    private tokenStorage: TokenStorageService,
    private userService: UserManagmentService,
    private messageService: MessageService,
    private dialogService: DialogService
  ) { }

  ngOnInit(): void {
    this.initializeColumns();
  }


  public loadUsers($event: TableLazyLoadEvent): void {
    const userFilter: commonFilter = this.buildUserFilter($event);
    this.userService.getUsersPaginated(userFilter).subscribe((data: any) => {
      this.users = data.content;
      this.totalElements = data.totalElements;
      this.cdr.detectChanges();
    });
  }

  private initializeColumns(): void {
    this.cols = [
      { header: 'username', field: 'username' },
      { header: 'email', field: 'email' },
      { header: 'role', field: 'roles' },
    ];
  }

  public onAddUser(): void {
    this.openUserDialog(null);
  }

  public onEditUser(user: User): void {
    this.openUserDialog(user);
  }

  public onDeleteUser(user: User): void {
    this.confirmationService.openDeleteConfirmation(
      `Are you sure you want to delete ${user.username}?`,
      () => this.deleteUser(user)
    );
  }

  private deleteUser(user: User): void {
    this.userService.softDeleteUser(user.id).subscribe(() => {
      this.removeUserFromList(user);
      this.messageService.add({
        severity: 'success',
        summary: 'User Deleted',
        detail: `${user.username} has been successfully deleted.`,
      });
    });
  }

  private removeUserFromList(user: User): void {
    const index = this.users.findIndex((el) => el.id === user.id);
    if (index > -1) {
      this.users.splice(index, 1);
      this.totalElements--;
      this.cdr.detectChanges();
    }
  }

  private buildUserFilter(event: TableLazyLoadEvent): commonFilter {
    return {
      filters: event.filters || {},
      size: (event.rows || 10) - 1,
      page: event.first ? event.first / 10 : 0,
      sortOrder: event.sortOrder || 1,
    };
  }

  private openUserDialog(user: User | null): void {
    const ref: DynamicDialogRef = this.dialogService.open(AddEditUserDialogComponent, {
      width: '40rem',
      data: { user },
      contentStyle: {
        'max-height': '80vh',
        overflow: 'hidden',
      },
    });

    ref.onClose.subscribe((updatedUser: User) => {
      if (updatedUser) {
        this.handleUserUpdate(updatedUser, user);
      }
    });
  }

  private handleUserUpdate(updatedUser: User, existingUser: User | null): void {
    this.messageService.add({
      severity: 'success',
      summary: 'User Add/Edit',
      detail: `${updatedUser.username} has been successfully updated.`,
    });

    if (existingUser) {
      this.updateExistingUser(updatedUser);
    } else {
      this.addNewUser(updatedUser);
    }
  }

  private updateExistingUser(updatedUser: User): void {
    const index = this.users.findIndex((u) => u.id === updatedUser.id);
    if (index > -1) {
      this.users[index] = updatedUser;
      this.cdr.detectChanges();
    }
  }

  private addNewUser(newUser: User): void {
    this.users.push({ ...newUser });
    this.totalElements++;
    this.cdr.detectChanges();
  }
}
