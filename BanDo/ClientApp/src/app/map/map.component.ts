import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';

declare const google: any;

@Component({
  selector: 'app-map-component',
  templateUrl: './map.component.html'
})
export class MapComponent implements OnInit {
  public drawPies: DrawPie[];
  public slots: Slot[];
  public projects: Project[];
  private httpClient: HttpClient;
  private baseUrl: string;
  private selectedDrawPie: DrawPie;
  private map: any;
  private selectedShape: any;

  private defaultPolygonOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35
  }

  private selectedPolygonOptions = {
    strokeColor: '#078a07',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#4cae4c',
    fillOpacity: 0.35
  }

  constructor(private ngZone: NgZone, http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string)
  {
    this.httpClient = http;
    this.baseUrl = '/';

    this.httpClient.get<DrawPie[]>(this.baseUrl + 'api/DrawPie/GetAll').subscribe(result => {
      this.drawPies = result;
      this.loadMap();
      this.drawPies.forEach((value) => {
        this.addShapeToMap(value, false);
      }); 
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
      });

    window['angularComponentReference'] = {
      zone: this.ngZone,
      componentFn: () => this.initMapInCompoment(),
      component: this,
    };
  }

  loadScript() {
    let body = <HTMLDivElement>document.body;
    //let scriptInit = document.createElement('script');
    //scriptInit.innerHTML = 'function initMap(){ window.angularComponentReference.zone.run(() = { window.angularComponentReference.componentFn(); });}';
    //body.appendChild(scriptInit);

    let script = document.createElement('script');
    script.innerHTML = '';
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBic-wDPuLxMuSh_2pmer5HoWn2wulhwtI&libraries=drawing&callback=initMapInCompoment';
    script.async = true;
    script.defer = true;
    body.appendChild(script);
  }

  ngOnInit() {
    //this.loadScript();
    this.initMapInCompoment();
    this.getAllProjects();
  }

  public initMapInCompoment(): any {
    this.loadMap();    

    let drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      }
    });
    google.maps.event.addListener(drawingManager, 'overlaycomplete', (e) => {

      if (e.type == google.maps.drawing.OverlayType.POLYGON) {
        drawingManager.setDrawingMode(null);
        this.selectedShape = e.overlay;
        this.selectedShape.type = e.type;
        this.selectedDrawPie = { id: 0, slot: new Slot(), bounds: '', slotId: null, addedDate: new Date(), updatedDate: new Date() };
        this.selectedDrawPie.bounds = JSON.stringify(this.selectedShape.getPath().j);

      }
    });
    this.selectedDrawPie = null;
    drawingManager.setMap(this.map);
  }

  getAllProjects() {
    this.httpClient.get<Project[]>(this.baseUrl + 'api/Project/GetAll').subscribe(result => {
      this.projects = result;
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  private findSlot(slotId: number) {
    if (this.slots && slotId != null && slotId!=0) {
      for (let slot of this.slots) {
        if (slot.id == slotId) {
          this.selectedDrawPie.slot = slot;
          return;
        }
      }
    }
   // this.selectedDrawPie.slot = new Slot();
  }

  public loadSlot(projectId: number) {
    if (projectId) {
      this.httpClient.get<Slot[]>(this.baseUrl + 'api/Slot/GetAllByProject/?projectId=' + projectId).subscribe(result => {
        this.slots = result;
        this.findSlot(this.selectedDrawPie.slotId);
      }, error => {
        alert('Có lỗi khi kết nối server!!!!!!');
      });
    }
  }

  loadMap() {
    if (this.map == null) {
      this.map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 16.0225247, lng: 108.2436832 },
        zoom: 16
      });
    }
  }

  public addShapeToMap(value: DrawPie, selected: boolean) {
    var bounds = JSON.parse(value.bounds);

    // Construct the polygon.
    var shape = new google.maps.Polygon({
      paths: bounds
    });
    google.maps.event.addListener(shape, 'click', () => {
      this.selectShape(value, shape);
    });
    shape.setOptions(this.defaultPolygonOptions);
    shape.setMap(this.map);

    if (selected) {
      this.selectShape(value, shape);
    }
  }

  public selectShape(value: any, shape:any) {
    if (this.selectedShape != null) {
      this.selectedShape.setOptions(this.defaultPolygonOptions);
    }
    this.selectedShape = shape;
    this.selectedDrawPie = value;
    this.selectedShape.setOptions(this.selectedPolygonOptions);
    if (this.selectedDrawPie) {
      if (this.selectedDrawPie.slot) {
        this.loadSlot(this.selectedDrawPie.slot.productId);
      } else {
        this.selectedDrawPie.slot = new Slot();
      }
    }
  }
  
  public cancel() {
    if (this.selectedShape!=null) {
      this.selectedShape.setMap(null);
      this.selectedShape = null;
    }
    this.selectedDrawPie = null;// { id: 0, bounds: '', addedDate: new Date(), updatedDate: new Date() };
  }

  public delete() {
    if (this.selectedDrawPie != null && this.selectedDrawPie.id > 0) {
      if (confirm('Bạn muốn xóa ' + this.selectedDrawPie.id + '?')) {
        this.httpClient.get(this.baseUrl + 'api/DrawPie/Delete/?id=' + this.selectedDrawPie.id)
          .subscribe(data => {
            this.cancel();
          }, error => {
            alert('Có lỗi khi kết nối server!!!!!!');
          });
      }
    }
  }

  public save() {
    if (this.selectedDrawPie != null && this.selectedDrawPie.bounds!='') {
      this.httpClient.post<DrawPie>(this.baseUrl + 'api/DrawPie/save', this.selectedDrawPie)
        .subscribe(data => {
          if (data == null) {
            alert('Có lỗi khi lưu dữ liệu!!!!!!');
          } else {
            this.selectedDrawPie = data;
            this.findSlot(this.selectedDrawPie.slotId);
            this.addShapeToMap(this.selectedDrawPie, true);
            alert('Đã Lưu!!!');
          }
        }, error => {
          alert('Có lỗi khi kết nối server!!!!!!');
        });
    }
  }
}

interface DrawPie {
  id: number;
  bounds: string;
  slotId: number;
  slot: Slot;
  addedDate: Date;
  updatedDate: Date;
}

class Slot {
  id: number;
  productId: number;
  name: string;
  direction: string;
  longInMeter: number;
  widthInMeter: number;
  WidthOfStreetInMeter: number;
  addedDate: Date;
  updatedDate: Date;
}
interface Project {
  id: number;
  name: string;
  address: string;
  progress: string;
  addedDate: Date;
  updatedDate: Date;
}
