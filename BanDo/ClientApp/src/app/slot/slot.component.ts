import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html'
})
export class SlotComponent implements OnInit {
  public slot: Slot;
  private httpClient: HttpClient;
  private baseUrl : string;

  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = '/';

    var id = this.route.snapshot.params['id'];
    if (id > 0) {
      http.get<Slot>(baseUrl + 'api/Customer/Get/?id=' + id).subscribe(result => {
        this.slot = result;
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    } else {
      this.slot = {
        id: 0,
        name: '',
        direction: '',
        longInMeter: 0,
        widthInMeter: 0,
        WidthOfStreetInMeter: 0,
        addedDate: new Date(),
        updatedDate: new Date()
      };
    }
  }
  ngOnInit() {

  //  customer.id = this.route.snapshot.params['id'];

  }

  moveToList() {
    this.router.navigate(['./slot'])
  }

  save() {
    this.httpClient.post<Slot>(this.baseUrl + 'api/Slot/save', this.slot)
      .subscribe(data => {
        if (data == null) {
          alert('Có lỗi khi lưu dữ liệu!!!!!!');
        } else {
          this.slot = data;
          alert('Đã Lưu!!!');
        }
      }, error => {
        console.error(error);
        alert('Có lỗi khi kết nối server!!!!!!');
  });
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
