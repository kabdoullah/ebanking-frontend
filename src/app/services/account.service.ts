import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountDetails } from '../models/accounts.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl: string = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  public getAccount(accountId: string, page: number, size: number): Observable<AccountDetails> {
    return this.http.get<AccountDetails>(this.baseUrl + "/accounts/" + accountId + "/pageOperations?page=" + page + "&size=" + size);
  }
  public debit(accountId: string, amount: number, description: string) {
    let data = { accountId: accountId, amount: amount, description: description }
    return this.http.post(this.baseUrl + "/accounts/debit", data);
  }
  public credit(accountId: string, amount: number, description: string) {
    let data = { accountId: accountId, amount: amount, description: description }
    return this.http.post(this.baseUrl + "/accounts/credit", data);
  }
  public transfer(accountSource: string, accountDestination: string, amount: number, description: string) {
    let data = { accountSource, accountDestination, amount, description }
    return this.http.post(this.baseUrl + "/accounts/transfer", data);
  }
}
