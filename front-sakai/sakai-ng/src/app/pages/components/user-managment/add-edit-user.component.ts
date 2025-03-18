import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { User, Role } from '../../../core/models/models';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog'; // PrimeNG DialogRef
import { CommonModule } from '@angular/common';
import { MultiSelectModule } from 'primeng/multiselect'; // PrimeNG MultiSelect
import { ButtonModule } from 'primeng/button'; // PrimeNG Button
import { InputTextModule } from 'primeng/inputtext'; // PrimeNG InputText
import { UserManagmentService } from './user-managment.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  template: `
  <div class="dialog-container max-h-96 overflow-y-auto">
    <h2 class="text-2xl font-bold mb-6">{{ edit ? 'Edit User' : 'Add User' }}</h2>

    <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="space-y-4">
      <div class="p-field">
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input id="username" pInputText formControlName="username" type="text" 
               class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none" />
      </div>

      <div class="p-field">
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input id="email" pInputText formControlName="email" type="email" 
               class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none" />
      </div>

      <div class="p-field" *ngIf="!edit">
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input id="password" pInputText formControlName="password" type="password"
               class="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-green-300 focus:outline-none" />
      </div>
      <div class="p-field">
  <label for="roles" class="block text-sm font-medium text-gray-700">Roles</label>
  <p-dropdown [options]="allRoles" formControlName="roles" optionLabel="label" optionValue="value" 
              [scrollHeight]="'200px'" [appendTo]="'body'" 
              class="w-full border border-gray-300 rounded-lg focus:ring focus:ring-green-300 focus:outline-none">
  </p-dropdown>
</div>

      <div class="flex justify-end gap-2 mt-6">
        <button pButton type="button" label="Cancel" class="p-button-outlined"
                (click)="dialogRef.close()"></button>
      <button pButton type="submit" label="Save" [disabled]="userForm.invalid"
              class="bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
      </button>
      </div>
    </form>
  </div>
  `,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, MultiSelectModule, DropdownModule, InputTextModule]
})
export class AddEditUserDialogComponent implements OnInit {
  user: User | null = null;
  userForm: FormGroup;
  edit: boolean = false;

  allRoles = [
    { label: 'Client', value: Role.CLIENT },
    { label: 'Warehouse Manager', value: Role.WAREHOUSE_MANAGER },
    { label: 'System Admin', value: Role.SYSTEM_ADMIN },
  ];

  constructor(
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    public dialogRef: DynamicDialogRef,
    private userService: UserManagmentService
  ) {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      roles: [[], Validators.required],
    });
  }

  ngOnInit(): void {
    this.user = this.config.data.user;

    if (this.user) {
      this.edit = true;
      this.userForm.patchValue({
        username: this.user.username,
        email: this.user.email,
        roles: this.user.roles[0]
      });
    } else {
      this.userForm.get('password')?.setValidators(Validators.required);
    }
  }


  public onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue();
      formValue.roles = [formValue.roles]
      const payload = { ...this.user, ...formValue };

      const saveOperation = this.edit
        ? this.userService.update(payload.id, payload)
        : this.userService.save(payload);

      saveOperation.subscribe((user) => {
        this.dialogRef.close(user);
      });
    }
  }
}
