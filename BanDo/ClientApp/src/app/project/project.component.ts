import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html'
})
export class ProjectComponent implements OnInit {
  public project: Project;
  private httpClient: HttpClient;
  private baseUrl : string;

  constructor(http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.httpClient = http;
    this.baseUrl = '/';

    var id = this.route.snapshot.params['id'];
    if (id > 0) {
      http.get<Project>(this.baseUrl + 'api/Project/Get/?id=' + id).subscribe(result => {
        this.project = result;
      }, error => {
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    } else {
      this.project = {
        id: 0,
        name: '',
        address: '',
        progress: '',
        addedDate: new Date(),
        updatedDate: new Date()
      };
    }
  }
  ngOnInit() {

  //  customer.id = this.route.snapshot.params['id'];

  }

  moveToList() {
    this.router.navigate(['./project'])
  }

  save() {
    this.httpClient.post<Project>(this.baseUrl + 'api/Project/save', this.project)
      .subscribe(data => {
        if (data == null) {
          alert('Có lỗi khi lưu dữ liệu!!!!!!');
        } else {
          this.project = data;
          alert('Đã Lưu!!!');
        }
      }, error => {
        alert('Có lỗi khi kết nối server!!!!!!');
  });
  }
}

interface Project {
  id: number;
  name: string;
  address: string;
  progress: string;
  addedDate: Date;
  updatedDate: Date;
}
