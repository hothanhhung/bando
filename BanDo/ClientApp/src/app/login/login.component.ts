import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent{
  public customer: Customer;
  private http: HttpClient;
  private baseUrl: string;
  public username: string;
  public password: string;
  public message: string;

  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;
    this.message = '';
  }

  login() {
    this.http.get<Customer[]>(this.baseUrl + 'api/Authenticate/login?username=' + this.username + '&password=' + this.password).subscribe(result => {
      if (result == null) {
        this.message = 'usename or password invalid!!!';
      } else {
        if (typeof (Storage) !== "undefined") {
          // Code for localStorage/sessionStorage.
          window.sessionStorage.setItem("currentUser", JSON.stringify(result));
          this.router.navigate(['./customer']);
        } else {
          // Sorry! No Web Storage support..
          alert('Sorry! No Web Storage support...');
        }
      }
    }, error => {
      console.error(error);
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }
}

interface Customer {
  username: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  addedDate: Date;
  updatedDate: Date;
}
