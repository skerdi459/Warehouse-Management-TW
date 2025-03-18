import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { TokenStorageService } from '../../core/auth/service/token-storage.service';
import { User } from '../../core/models/models';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [CommonModule, StyleClassModule, AppConfigurator],
    template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <span>TASKWORK</span>
                <i class="pi pi-shop"></i>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <!-- Profile Button -->
            <button type="button" class="layout-topbar-action" (click)="togglePopover()">
                <i class="pi pi-user"></i>
                <span>Profile</span>
            </button>

            <div *ngIf="showProfile" class="popover-content">
          <div class="popover-header">
            <i class="pi pi-user-circle"></i>
            <h5>{{ user?.username }}</h5>
            <small>{{ user?.roles }}</small>
          </div>

          <div class="popover-actions">
            <button type="button" class="logout-button" (click)="logout()">
              <i class="pi pi-sign-out"></i> Logout
            </button>
          </div>
        </div>
        </div>
    </div>
    `,
    styles: [
        `
        .popover-content {
            position: absolute;
            top: 60px;
            right: 10px;
            background-color: white;
            padding: 1rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 0.5rem;
            z-index: 100;
        }
        .logout-button {
            border: none;
            color: red;
            cursor: pointer;
            margin-top: 0.5rem;
        }
        `
    ]
})
export class AppTopbar {

    showProfile = false;
    user:User | null | undefined

    constructor(public layoutService: LayoutService, private authService : TokenStorageService,private router: Router) {}


    togglePopover() {
        this.user = this.authService.getUser()
        this.showProfile = !this.showProfile;
    }

    logout() {
        this.authService.signOut()
        this.router.navigate(['/login']);
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }
}
