import { Component, Inject, HostBinding, Input} from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  //styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  isExpanded = false;
  private http: HttpClient;
  private baseUrl: string;

  @HostBinding('class.current-user') @Input()
  private currentUser;
  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = '/';
    //var str = window.sessionStorage.getItem("currentUser");
    //if (str) {
    //  this.currentUser = JSON.parse(str);
    //}
  }

  logout() {
    this.http.get<Customer[]>(this.baseUrl + 'api/Authenticate/Logout').subscribe(result => {
      window.sessionStorage.removeItem("currentUser");
      this.currentUser = null;
      this.router.navigate(['./login']);
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
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
