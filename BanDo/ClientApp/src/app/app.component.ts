import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  //styleUrls: ['./app.component.css']
})
export class AppComponent {
  private http: HttpClient;
  private baseUrl: string;

  title = 'app';
  currentUser = null;
  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = '/';

    this.login();
  }

  login() {
    this.http.get<Customer[]>(this.baseUrl + 'api/Authenticate/IsLogin').subscribe(result => {
      if (result == null) {
        window.sessionStorage.removeItem("currentUser");
        this.currentUser = null;
        this.router.navigate(['./login']);
      } else {
        if (typeof (Storage) !== "undefined") {
          window.sessionStorage.setItem("currentUser", JSON.stringify(result));
          this.currentUser = result;
        } else {
          alert('Sorry! No Web Storage support...');
        }
      }
    }, error => {
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
