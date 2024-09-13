import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Observable, catchError, throwError } from 'rxjs';
import { AccountDetails } from '../models/accounts.model';
import { AccountService } from '../services/account.service';
import { AsyncPipe, DatePipe, DecimalPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, NgClass, DatePipe, AsyncPipe],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent {
  accountFormGroup: FormGroup = new FormGroup({
    accountId: new FormControl('')
  });
  currentPage: number = 0;
  pageSize: number = 5;
  accountObservable!: Observable<AccountDetails>
  operationFromGroup: FormGroup = new FormGroup({
    operationType: new FormControl(''),
    amount: new FormControl(0),
    description: new FormControl(''),
    accountDestination: new FormControl('')
  });
  errorMessage!: string;

  constructor(private accountService: AccountService) { }


  handleSearchAccount() {
    let accountId: string = this.accountFormGroup.value.accountId;
    this.accountObservable = this.accountService.getAccount(accountId, this.currentPage, this.pageSize).pipe(
      catchError(err => {
        this.errorMessage = err.message;
        return throwError(err);
      })
    );
  }

  gotoPage(page: number) {
    this.currentPage = page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
    let accountId: string = this.accountFormGroup.value.accountId;
    let operationType = this.operationFromGroup.value.operationType;
    let amount: number = this.operationFromGroup.value.amount;
    let description: string = this.operationFromGroup.value.description;
    let accountDestination: string = this.operationFromGroup.value.accountDestination;
    if (operationType == 'DEBIT') {
      this.accountService.debit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Credit");
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    } else if (operationType == 'CREDIT') {
      this.accountService.credit(accountId, amount, description).subscribe({
        next: (data) => {
          alert("Success Debit");
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
    else if (operationType == 'TRANSFER') {
      this.accountService.transfer(accountId, accountDestination, amount, description).subscribe({
        next: (data) => {
          alert("Success Transfer");
          this.operationFromGroup.reset();
          this.handleSearchAccount();
        },
        error: (err) => {
          console.log(err);
        }
      });

    }
  }
}
