import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {
  public customer: Customer;
  private httpClient: HttpClient;
  private baseUrl : string;

  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = '/';

    var id = this.route.snapshot.params['id'];
    if (id > 0) {
      http.get<Customer>(baseUrl + 'api/Customer/Get/?customerId=' + id).subscribe(result => {
        this.customer = result;
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    } else {
      this.customer = {
        id: 0,
        name: '',
        address: '',
        phone: '',
        email: '',
        addedDate: new Date(),
        updatedDate: new Date()
      };
    }
  }
  ngOnInit() {

  //  customer.id = this.route.snapshot.params['id'];

  }

  moveToList() {
    this.router.navigate(['./customer'])
  }

  save() {
    this.httpClient.post<Customer>(this.baseUrl + 'api/Customer/save', this.customer)
      .subscribe(data => {
        if (data == null) {
          alert('Có lỗi khi lưu dữ liệu!!!!!!');
        } else {
          this.customer = data;
          alert('Đã Lưu!!!');
        }
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
  });
  }
}

interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  addedDate: Date;
  updatedDate: Date;
}
