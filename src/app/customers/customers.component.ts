import { Component, OnInit } from '@angular/core';
import { Customer } from '../models/customer.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css'
})
export class CustomerComponent implements OnInit {
  customers!: Observable<Array<Customer>>;
  errorMessage!: string;

  searchFormGroup: FormGroup = new FormGroup({
    keyword: new FormControl("")
  });

  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit(): void {
    this.handleSearchCustomers();
  }
  handleSearchCustomers() {
    let kw = this.searchFormGroup?.value.keyword;
    this.customers = this.customerService.searchCustomers(kw).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(() => new Error(err.message));
      })
    );
  }

  handleDeleteCustomer(c: Customer) {
    let conf = confirm("Are you sure?");
    if (!conf) return;
    this.customerService.deleteCustomer(c.id).subscribe({
      next: (resp) => {
        this.customers = this.customers.pipe(
          map(data => {
            let index = data.indexOf(c);
            data.slice(index, 1)
            return data;
          })
        );
      },
      error: err => {
        console.log(err);
      }
    })
  }

  handleCustomerAccounts(customer: Customer) {
    this.router.navigateByUrl("/customer-accounts/" + customer.id, { state: customer });
  }
}
