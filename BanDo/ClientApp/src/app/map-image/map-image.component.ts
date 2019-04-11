import { Component, Inject, NgZone, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forEach } from '@angular/router/src/utils/collection';

declare const fabric: any;
declare const window: any;
declare const $: any;

@Component({
  selector: 'app-map-image-component',
  templateUrl: './map-image.component.html',
  styleUrls: ['./map-image.component.css']
})
export class MapImageComponent implements OnInit {
  public drawPies: DrawPie[];
  public slots: Slot[];
  public projects: Project[];
  private httpClient: HttpClient;
  private baseUrl: string;
  private selectedDrawPie: DrawPie;
  private canvas: any;
  private selectedShape: any;

  private min = 99;
  private max = 999999;
  public polygonMode = false;
  private pointArray = new Array();
  private lineArray = new Array();
  private activeLine: any;
  private activeShape:any;
  private drawing = false;
  private lastX = 0;
  private lastY = 0;

  constructor(private ngZone: NgZone, http: HttpClient, private route: ActivatedRoute, private router: Router, @Inject('BASE_URL') baseUrl: string)
  {
    this.httpClient = http;
    this.baseUrl = '/';

    this.httpClient.get<DrawPie[]>(this.baseUrl + 'api/DrawPieImage/GetAll').subscribe(result => {
      this.drawPies = result;
      this.loadMap();
      this.drawPies.forEach((value) => {
        this.addShapeToMap(value, false);
      }); 
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
      });
  }

  ngOnInit() {
    this.initMapInCompoment();
    this.getAllProjects();
  }
  
  addPoint(options) {
    var random = Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;
    var id = new Date().getTime() + random;
    var circle = new fabric.Circle({
      radius: 5,
      fill: '#ffffff',
      stroke: '#333333',
      strokeWidth: 0.5,
      left: (options.e.layerX / this.canvas.getZoom()),
      top: (options.e.layerY / this.canvas.getZoom()),
      selectable: false,
      hasBorders: false,
      hasControls: false,
      originX: 'center',
      originY: 'center',
      id: id,
      objectCaching: false
    });
    if (this.pointArray.length == 0) {
      circle.set({
        fill: 'red'
      })
    }
    var points = [(options.e.layerX / this.canvas.getZoom()), (options.e.layerY / this.canvas.getZoom()), (options.e.layerX / this.canvas.getZoom()), (options.e.layerY / this.canvas.getZoom())];
    let line = new fabric.Line(points, {
      strokeWidth: 2,
      fill: '#999999',
      stroke: '#999999',
      class: 'line',
      originX: 'center',
      originY: 'center',
      selectable: false,
      hasBorders: false,
      hasControls: false,
      evented: false,
      objectCaching: false
    });
    if (this.activeShape) {
      let pos = this.canvas.getPointer(options.e);
      let points = this.activeShape.get("points");
      points.push({
        x: pos.x,
        y: pos.y
      });
      var polygon = new fabric.Polygon(points, {
        stroke: '#333333',
        strokeWidth: 1,
        fill: '#cccccc',
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false
      });
      this.canvas.remove(this.activeShape);
      this.canvas.add(polygon);
      this.activeShape = polygon;
      this.canvas.renderAll();
    }
    else {
      var polyPoint = [{ x: (options.e.layerX / this.canvas.getZoom()), y: (options.e.layerY / this.canvas.getZoom()) }];
      var polygon = new fabric.Polygon(polyPoint, {
        stroke: '#333333',
        strokeWidth: 1,
        fill: '#cccccc',
        opacity: 0.3,
        selectable: false,
        hasBorders: false,
        hasControls: false,
        evented: false,
        objectCaching: false
      });
      this.activeShape = polygon;
      this.canvas.add(polygon);
    }
    this.activeLine = line;

    this.pointArray.push(circle);
    this.lineArray.push(line);

    this.canvas.add(line);
    this.canvas.add(circle);
    this.canvas.selection = false;
  }

  generatePolygon(pointArray) {
    var points = new Array();
    $.each(pointArray, function (index, point) {
      points.push({
        x: point.left,
        y: point.top
      });
      this.canvas.remove(point);
    });
    $.each(this.lineArray, function (index, line) {
      this.canvas.remove(line);
    });
    this.canvas.remove(this.activeShape).remove(this.activeLine);
    this.selectedDrawPie = { id: 0, slot: new Slot(), bounds: '', slotId: null, addedDate: new Date(), updatedDate: new Date() };
    this.selectedDrawPie.bounds = JSON.stringify(points);

    this.addShapeToMap(this.selectedDrawPie, true);

    this.activeLine = null;
    this.activeShape = null;
    this.polygonMode = false;
    this.canvas.selection = true;
  }

  updateScroll(offsetX: number, offsetY: number) {

  if (!offsetX) offsetX = 0;
  if (!offsetY) offsetY = 0;

  var pointX = $('#map').scrollLeft() + offsetX;
  var pointY = $('#map').scrollTop() + offsetY;

    var maxX = this.canvas.getWidth() * this.canvas.getZoom() - $('#map').width();
    var maxY = this.canvas.getHeight() * this.canvas.getZoom() - $('#map').height();

  if (pointX < 0 || maxX < 0) pointX = 0;
  else if (pointX > maxX) pointX = maxX;

  if (pointY < 0 || maxY < 0) pointY = 0;
  else if (pointY > maxY) pointY = maxY;

  $('#map').scrollLeft(pointX);
  $('#map').scrollTop(pointY);
}


  public initMapInCompoment() {
    this.loadMap();    
  
  // canvas.setWidth($(window).width());
  // canvas.setHeight($(window).height()-$('#nav-bar').height());
  //canvas.selection = false;

  /*anvas.setBackgroundImage('./index.jpg', canvas.renderAll.bind(canvas), {
      // Optionally add an opacity lvl to the image
      backgroundImageOpacity: 0.5,
      // should the image be resized to fit the container?
      //backgroundImageStretch: true
       scaleX: canvas.width / img.width,
      scaleY: canvas.height / img.height
  });
  */
  fabric.Image.fromURL('/manager/assets/phanlo.jpg', (img) => {
    this.canvas.setWidth(img.width);
    this.canvas.setHeight(img.height);
    this.canvas.setBackgroundImage(img, this.canvas.renderAll.bind(this.canvas), {
      scaleX: this.canvas.width / img.width,
      scaleY: this.canvas.height / img.height
    });
    this.canvas.setZoom(0.5);
  });


  this.canvas.on('mouse:down', (options) => {

      if (options.target && this.pointArray.length && options.target.id == this.pointArray[0].id) {
      this.generatePolygon(this.pointArray);
    }
    if (this.polygonMode) {
      this.addPoint(options);
    } else {
      this.canvas.setCursor('all-scroll');
      this.drawing = true;
      this.updateScroll((this.lastX - options.e.clientX), (this.lastY - options.e.clientY));
      this.lastX = options.e.clientX;
      this.lastY = options.e.clientY;
    }
  });
    this.canvas.on('mouse:up', (options) => {
      if (this.drawing) {
        this.drawing = false;
      }
  });
    this.canvas.on('mouse:move', (options) => {
      if (this.polygonMode) {
        this.canvas.setCursor('crosshair');
      }
    if (this.activeLine && this.activeLine.class == "line") {
      
      var pointer = this.canvas.getPointer(options.e);
      this.activeLine.set({ x2: pointer.x, y2: pointer.y });

      var points = this.activeShape.get("points");
      points[this.pointArray.length] = {
        x: pointer.x,
        y: pointer.y
      }
      this.activeShape.set({
        points: points
      });
      this.canvas.renderAll();
    }
    // this.canvas.renderAll();
    else if (this.drawing) {
      $('#map').scrollLeft($('#map').scrollLeft() + (this.lastX - options.e.clientX));
      $('#map').scrollTop($('#map').scrollTop() + (this.lastY - options.e.clientY));
      this.lastX = options.e.clientX;
      this.lastY = options.e.clientY;
    }
  });
    this.canvas.on('mouse:wheel', (opt) => {
      var delta = opt.e.deltaY;
      if (delta > 0) {
        this.zoomAction(false);
      } else {
        this.zoomAction(true);
      }
    });
  }

 public zoomAction(zoomIn: boolean) {
    var zoom = this.canvas.getZoom();
    if (zoomIn) {
      if (zoom >= 1) zoom += 1;
      else zoom += 0.1;
    } else {
      if (zoom > 1) zoom -= 1;
      else zoom -= 0.1;
    }
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    this.canvas.setZoom(zoom);
    this.updateScroll(0, 0);
  }
  getAllProjects() {
    this.httpClient.get<Project[]>(this.baseUrl + 'api/Project/GetAll').subscribe(result => {
      this.projects = result;
    }, error => {
      alert('Có lỗi khi kết nối server!!!!!!');
    });
  }

  private findSlot(slotId: number) {
    if (this.slots && slotId != null && slotId != 0) {
      for (let slot of this.slots) {
        if (slot.id == slotId) {
          this.selectedDrawPie.slot = slot;
          return;
        }
      }
    }
  //  this.selectedDrawPie.slot = new Slot();
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
  if (this.canvas == null) {
      this.canvas = window._canvas = new fabric.Canvas('c', {
        hoverCursor: 'pointer',
        selection: true,
        selectionBorderColor: 'green',
        backgroundColor: null
      });
    }
  }

  public addShapeToMap(value: DrawPie, selected: boolean) {
    var points = JSON.parse(value.bounds);
    var shape = new fabric.Polygon(points, {
      stroke: '#333333',
      strokeWidth: 0.5,
      fill: '#f137375c',
      opacity: 1,
      hasBorders: false,
      hasControls: false,
      lockMovementX: true,
      lockMovementY: true
    });
    shape.on("selected", (event) => {
      // showPopup(event);
      //alert("port selected!"); // CHILD EVENT NEVER FIRED, expected to fire when port is clicked
      this.selectShape(value, shape);
    });
    this.canvas.add(shape);

    if (selected) {
      this.selectShape(value, shape);
    }
  }

  public selectShape(value: any, shape:any) {
    if (this.selectedShape != null) {
      this.selectedShape.set('fill', '#f137375c');
    }
    this.selectedShape = shape;
    this.selectedDrawPie = value;
    this.selectedShape.set('fill','#37f1375c');
    this.canvas.renderAll();

    if (this.selectedDrawPie) {
      if (this.selectedDrawPie.slot) {
        this.loadSlot(this.selectedDrawPie.slot.productId);
      } else {
        this.selectedDrawPie.slot = new Slot();
      }
    }
  }

  public create() {
    this.polygonMode = true;
    this.pointArray = new Array();
    this.lineArray = new Array();
    this.activeLine = null;
  }

  public cancel() {
    if (this.selectedShape!=null) {
      this.canvas.remove(this.selectedShape);
      this.selectedShape = null;
      this.canvas.renderAll();
    }
    this.selectedDrawPie = null;// { id: 0, bounds: '', addedDate: new Date(), updatedDate: new Date() };
  }

  public delete() {
    if (this.selectedDrawPie != null && this.selectedDrawPie.id > 0) {
      if (confirm('Bạn muốn xóa ' + this.selectedDrawPie.id + '?')) {
        this.httpClient.get(this.baseUrl + 'api/DrawPieImage/Delete/?id=' + this.selectedDrawPie.id)
          .subscribe(data => {
            this.cancel();
          }, error => {
            alert('Có lỗi khi kết nối server!!!!!!');
          });
      }
    }
  }

  public save() {
    if (this.selectedDrawPie != null && this.selectedDrawPie.bounds != '') {
      this.httpClient.post<DrawPie>(this.baseUrl + 'api/DrawPieImage/save', this.selectedDrawPie)
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
