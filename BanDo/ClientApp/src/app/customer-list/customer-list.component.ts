import { Component, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-customer',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {
  public customers: Customer[];
  private http: HttpClient;
  private baseUrl: string;

  constructor(http: HttpClient, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;

    this.getAll();
  }

  getAll() {
    this.http.get<Customer[]>(this.baseUrl + 'api/Customer/GetAll').subscribe(result => {
      this.customers = result;
    }, error => {
      console.error(error);
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  openDetail(id) {
    this.router.navigate(['./customer', id])
  }

  addNew() {
    this.router.navigate(['./customer', 0])
  }

  delete(customer) {
    if (confirm('Bạn muốn xóa '+ customer.name + '?')) {
      this.http.get<Customer[]>(this.baseUrl + 'api/Customer/Delete/?id=' + customer.id).subscribe(result => {
        this.getAll();
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    }
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
