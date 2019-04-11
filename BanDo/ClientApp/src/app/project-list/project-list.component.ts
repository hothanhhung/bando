import { Component, Inject } from '@angular/core';
import { Router} from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-project',
  templateUrl: './project-list.component.html'
})
export class ProjectListComponent {
  public projects: Project[];
  private http: HttpClient;
  private baseUrl: string;

  constructor(http: HttpClient, private router: Router, @Inject('BASE_URL') baseUrl: string) {
    this.http = http;
    this.baseUrl = '/';

    this.getAll();
  }

  getAll() {
    this.http.get<Project[]>(this.baseUrl + 'api/Project/GetAll').subscribe(result => {
      this.projects = result;
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  openDetail(id) {
    this.router.navigate(['./project', id])
  }

  addNew() {
    this.router.navigate(['./project', 0])
  }

  delete(customer) {
    if (confirm('Bạn muốn xóa '+ customer.name + '?')) {
      this.http.get<Project[]>(this.baseUrl + 'api/Project/Delete/?id=' + customer.id).subscribe(result => {
        this.getAll();
      }, error => {
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    }
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
