import { Injectable } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class DeleteDialogService {
  constructor(private confirmationService: ConfirmationService) {}

  openDeleteConfirmation(message: string, acceptCallback: () => void): void {
    this.confirmationService.confirm({
      message: message,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        acceptCallback(); 
      },
    });
  }
}
