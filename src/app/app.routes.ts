import { Routes } from '@angular/router';
import { authenticationGuard } from './guards/authentication.guard';
import { authorizationGuard } from './guards/authorization.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
    {
        path: 'admin', loadComponent: () => import('./admin-template/admin-template.component').then(m => m.AdminTemplateComponent),
        canActivate: [authenticationGuard],
        children: [
            { path: 'customers', loadComponent: () => import('./customers/customers.component').then(m => m.CustomerComponent) },
            {
                path: 'new-customer', loadComponent: () => import('./new-customer/new-customer.component').then(m => m.NewCustomerComponent),
                canActivate: [authorizationGuard]
            },
            { path: 'accounts', loadComponent: () => import('./accounts/accounts.component').then(m => m.AccountsComponent) },
            { path: 'customer-accounts/:id', loadComponent: () => import('./customer-accounts/customer-accounts.component').then(m => m.CustomerAccountsComponent) },
            { path: 'not-authorized', loadComponent: () => import('./not-authorized/not-authorized.component').then(m => m.NotAuthorizedComponent) }
        ]
    },

];
