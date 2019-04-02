import { Component, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-slot',
  templateUrl: './slot-list.component.html'
})
export class SlotListComponent {
  public slots: Slot[];
  private http: HttpClient;
  private baseUrl: string;

  constructor(http: HttpClient, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = baseUrl;

    this.getAll();
  }

  getAll() {
    this.http.get<Slot[]>(this.baseUrl + 'api/Slot/GetAll').subscribe(result => {
      this.slots = result;
    }, error => {
      console.error(error);
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  openDetail(id) {
    this.router.navigate(['./slot', id])
  }

  addNew() {
    this.router.navigate(['./slot', 0])
  }

  delete(customer) {
    if (confirm('Bạn muốn xóa '+ customer.name + '?')) {
      this.http.get<Slot[]>(this.baseUrl + 'api/Slot/Delete/?id=' + customer.id).subscribe(result => {
        this.getAll();
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    }
  }
}

interface Slot {
  id: number;
  name: string;
  direction: string;
  longInMeter: number;
  widthInMeter: number;
  WidthOfStreetInMeter: number;
  addedDate: Date;
  updatedDate: Date;
}
