import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { TokenStorageService } from './service/token-storage.service';
import { Role } from '../models/models';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective {
  constructor(
    private authService: TokenStorageService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appHasRole(role: Role) {    
    if (this.authService.hasRole(role)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
