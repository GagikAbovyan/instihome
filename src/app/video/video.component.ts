import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { FileUploader } from 'ng2-file-upload';
import { Http, RequestOptions } from '@angular/http';
import { DataService } from '../data.service';

const URL:string = environment.API_URL + 'upload';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit{

  /*
   *HTML Element references
   */ 
  @ViewChild('fileInput') fileInput:ElementRef;
  @ViewChild('canvas') canvasOutput:ElementRef;
  @ViewChild('video') video:ElementRef;
  @HostListener('window:keyup', ['$event'])
  
  /*
   *  for delete rects by keyboard 
   */
  keyEvent(event:KeyboardEvent) {
    if(event.key === environment.DELETE && this.dataService.getSelected()) {
      this.rects.splice(this.rects.length - 1, this.rects.length);
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.drawRectangles();
    }
    if(event.key === environment.DELETE && !this.dataService.getSelected()) {
      if(this.index === this.rects.length - 1){
        this.rects.pop();
      }
      if(this.index === 0) {
        this.rects.shift();
      }
      this.rects.splice(this.index, this.index);
      this.index = this.prevIndex;
      
      if(this.prevIndex === undefined) this.index = this.rects.length - 1;
      this.index = this.rects.length - 1;
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.drawRectangles();
    }
  }

 /*
  *uploader utils
  */
  public uploader:FileUploader = new FileUploader({url:URL, itemAlias:'file'});
  public API:string = environment.API_URL;

  /*
   * mouse variables
   */ 
  private dragTL:boolean = false; 
  private dragBL:boolean = false; 
  private dragTR:boolean = false; 
  private dragBR:boolean = false; 
  private last_mousex:number;
  private last_mousey:number;
  private mousex:number;
  private mousey:number;
  private mousedown:Boolean;

  /*
   * variables fir canvas, rects and streaming
   */ 
  private canvas:any; 
  private rects = [];
  private indexForR:number = 0;
  private prevIndex:number;
  private isClearCanvas:boolean = false; 
  private ctx:any;
  private canvasx:number;
  private canvasy:number;
  private index:number = this.rects.length - 1;
  private streaming:boolean = false;
  private closeEnough:number = 7;

  constructor(private http:Http, private dataService:DataService) {}

  ngOnInit():void {}

  /*
   * initialize which variables must init after view init
   */
  ngAfterViewInit():void { 
    const imgSize:number = this.changeCanvas();   
    this.canvas = document.getElementById('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvasx = this.canvas.offsetLeft;
    this.canvasy = this.canvas.offsetTop;
    const { x, y } = this.canvasOutput.nativeElement.getBoundingClientRect();
    this.canvasx = x;
    this.canvasy = y;
    this.last_mousex = 0;
    this.last_mousey = 0;
    this.mousex = 0;
    this.mousey = 0;
    this.mousedown = false;
    const image = new Image();
    image.onload = ():void => {
      this.ctx.drawImage(image, imgSize, imgSize, imgSize, imgSize);
    }
    image.src = environment.IMAGE_URL;
  }

  private changeCanvas():number {
    if((window.innerWidth > 1024  && window.innerWidth <= 1440) || (window.innerHeight > 600 && window.innerHeight <= 900)) {
      document.getElementById('canvas').setAttribute('height', '440px');
      document.getElementById('canvas').setAttribute('width', '457px');
      this.video.nativeElement.setAttribute('height', '440px');
      this.video.nativeElement.setAttribute('width', '457px');
      return 150;
    }else if(window.innerWidth <= 1024 || window.innerHeight <= 600) { 
      document.getElementById('canvas').setAttribute('height', '350px');
      document.getElementById('canvas').setAttribute('width', '354px');
      this.video.nativeElement.setAttribute('height', '350px');
      this.video.nativeElement.setAttribute('width', '354px');
      return 120;
    }
    return 200;
  }

  /*
   * upload files ang get url
   */
  private sendFiles():void {
    this.rects = [];
    this.dataService.clearRectParams();
    this.indexForR = 0;
    this.dataService.disableClass();
    const loadDiv:HTMLElement = document.getElementById('load-div');
    loadDiv.className = 'block';
    this.uploader.onCompleteItem = (item:any, response:any, status:any, headers:any) => {
      let jsonRes:any;
      try {
        jsonRes = JSON.parse(response);
      }
      catch(err) {
        console.error('Error: to upload time', err);
      }
      loadDiv.className = 'block visibility';
      this.API = environment.API_URL + jsonRes.fileName;
    }
  }

  /*
   * detect selected file
   */
  public detectFiles():void {
    this.uploader.uploadAll();
    this.sendFiles();
  }

  /*
   * download zip file from back-end
   */
  public exportData():void {
    const loadDiv:HTMLElement = document.getElementById('load-div');
    loadDiv.className = 'block';
    this.http.get(environment.API_URL + 'export').subscribe((res:any) => {
      window.location.href = environment.API_URL + res.json().zipLink + '.zip';
      loadDiv.className = 'block visibility';
    });
  }


  /*
   * invoke correct vrables and call fucntion which send data to back-end 
   */
  public sendData():void {
    if(this.indexForR != 0) {
      let rectsForR = [];
      for (let index = this.indexForR; index < this.rects.length; index++) {
        const element = this.rects[index];
        rectsForR.push({
                        x:element.x, y:element.y, 
                        width:element.width, height:element.height, 
                        realX:element.realX, realY:element.realY, 
                        color:element.color, name:element.name
                        });
      }
      this.sendRects(rectsForR);
      this.indexForR = this.rects.length;
      return;
    }
    this.sendRects(this.rects);
    this.indexForR = this.rects.length;
  }

  /*
   * send data to back-end
   */
  private sendRects(data:any):void {
    this.dataService.sendMessage(data);
    this.dataService.getMessages().subscribe((message:any) => {});
  }

  /*
   * track objects in read video time 
   */
  public readVideo():void {
    const me = this;
    const video:any = document.getElementById('video');
    let src:any;
    let cap:any;
    video.addEventListener('pause', stop);
    start();
    function start():void {
      me.streaming = true;
      const width = video.width;
      const height = video.height;
      src = new cv.Mat(height, width, cv.CV_8UC4);
      src.crossOrigin = 'Anonymous';
      cap = new cv.VideoCapture(video);
      setTimeout(processVideo, 80);
    }

    function processVideo():void {

      if (!me.streaming) {
        src.delete();
        return;
      }
      // const progressVideo = document.getElementById('progress-video');
      // progressVideo.style.width = Number(me.video.nativeElement.currentTime % me.video.nativeElement.duration) * 10 + '%';
      // vid.currentTime % vid.duration
      let totalSeconds:number = this.video.currentTime;
      me.setTime(totalSeconds);

      src.crossOrigin = 'Anonymous';
      cap.read(src);
      me.sendImage();
      me.ctx.drawImage(video, 0, 0, me.canvas.width, me.canvas.height);
      setTimeout(processVideo, 80); 
    }
    function stop():void { 
      if(video.currentTime === video.duration) {
        const playIcon = document.getElementById('play');
        playIcon.className = 'fa fa-play-circle';
      }
      me.streaming = false; 
    }
  }

  /*
   * set current video time 
   */
  private setTime(totalSeconds:number):void {
    const hours:number = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes:number = Math.floor(totalSeconds / 60);
    const seconds:number = totalSeconds % 60;

    const minutesStr:string = String(minutes).padStart(1, "0");
    const hoursStr:string = String(hours).padStart(1, "0");
    const secondsStr:string = String(seconds).padStart(2, "0");
    const timeVideo = document.getElementById('time-video');
    const hoursStart = (Number(hoursStr.split('.')[0]) < 10) ? '0' : '';      
    const minStart = (Number(minutesStr.split('.')[0]) < 10) ? ':0' : ':';
    const secondStart = (Number(secondsStr.split('.')[0]) < 10) ? ':0' : ':';
    timeVideo.innerText = hoursStart + hoursStr + minStart + minutesStr + secondStart + secondsStr.split('.')[0];
  }

  /*
   * get canvas url data
   */
  private captureVideo(video:HTMLVideoElement):string {
    const canvas = document.createElement('canvas');
    const ct = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ct.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png');
  }

  /*
   * send frame data to back-end
   */
  private sendImage():void {
    const type:string = 'image/png';
    const video = <HTMLVideoElement> document.getElementById('video');
    let data:string = this.captureVideo(video);
    data = data.replace('data:' + type + ';base64,', ''); 
    const user = {data:{url:data, width:this.canvas.width, height:this.canvas.height}};
    const headers:any = new Headers({ 'Content-Type':'application/json'});
    const options = new RequestOptions({ headers:headers});
    this.http.post(environment.API_URL + 'track', user, options)
      .subscribe((res) => {
        const bboxes = JSON.parse(JSON.stringify(res))
        const body = JSON.parse(bboxes._body);
        if(body.className === undefined) return;
        const innerClasses:any = body.className;
        const rectsForDraw = body.rects;
        rectsForDraw.forEach((rect:any) => {
          if(rect[0] > 0 && rect[1] > 0) {
            let indexClasses = 0;
            this.dataService.getClasses().forEach((clazz:any) => {
              if(clazz.name === innerClasses[rectsForDraw.indexOf(rect)]) {
                indexClasses = this.dataService.getClasses().indexOf(clazz);
              }            
            });
            this.drawRect(rect, indexClasses); 
          }
        });
    });
  }


  /*
   * select rectangle
   */
  private onSelectRect(event:MouseEvent):number {
    let saveDilations:any = [];
    for(let i:number = 0; i < this.rects.length; ++i) {
      const toLeft:number = this.rects[i].realX - this.rects[i].width; 
      const toTop:number = this.rects[i].realY - this.rects[i].height;
      if(event.clientX < this.rects[i].realX && event.clientY < this.rects[i].realY
         && event.clientX > toLeft && event.clientY > toTop) {
        saveDilations.push({mouseX:event.clientX, mouseY:event.clientY,
                            rect:this.rects[i], index:i});
        this.index = i;
      }
    }
    if(saveDilations.length === 1) return this.index;
    for(let i:number = 1; i < saveDilations.length; ++i) {
      const prevRect = saveDilations[i - 1].rect;
      const rect = saveDilations[i].rect;
      if(rect.realX - saveDilations[i].mouseX < prevRect.realX - saveDilations[i].mouseX) return saveDilations[i].index;
      else{
        return saveDilations[i-1].index;
      }
    }
  }

  /*
   * draw All rectangles
   */
  private drawRectangles():void {
    if(this.isClearCanvas === true) {this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);}
    this.isClearCanvas = false;
    this.drawRectByIndex(0);
  }

  /*
   * draw rects by index
   */
  private drawRectByIndex(index:number):void {
    if(this.isClearCanvas === true) {this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);}
    this.isClearCanvas = false;
    for(let i:number = index; i < this.rects.length; i++) {
      const rect = this.rects[i];
      this.ctx.beginPath();
      this.ctx.rect(rect.x, rect.y, rect.width, rect.height);
      this.ctx.strokeStyle = rect.color;
      this.ctx.lineWidth = environment.LINE_WIDTH;
      this.ctx.stroke();
      this.ctx.fillStyle = rect.color;
      this.ctx.font = environment.FONT_SIZE;
      this.ctx.fillText(rect.name, rect.x + 2, rect.y + 10);
      this.ctx.closePath();
      if(!this.dataService.getSelected()) this.drawHandles();
    }
  }

  /*
   * draw rects by rect as argument
   */
  private drawRect(rect:any, index:number):void {
    if(this.isClearCanvas === true) {this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);}
      this.isClearCanvas = false;
      this.ctx.beginPath();
      this.ctx.rect(rect[0], rect[1], rect[2], rect[3]);
      this.ctx.strokeStyle = this.dataService.getClasses()[index].color;
      this.ctx.lineWidth = environment.LINE_WIDTH;
      this.ctx.stroke();
      this.ctx.fillStyle = this.dataService.getClasses()[index].color;;
      this.ctx.font = environment.FONT_SIZE;
      this.ctx.fillText(this.dataService.getClasses()[index].name, rect[0] + 2, rect[1] + 10);
      this.ctx.closePath();
      if(!this.dataService.getSelected()) this.drawHandles();
  }

  /*
   * draw circles for mouse resize
   */
  private drawCircle(x:number, y:number, radius:number):void {
    this.ctx.fillStyle = environment.RED;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  /*
   * draw handles for mouse resize
   */
  private drawHandles():void {
    if(this.dataService.getSelected()) this.index = this.rects.length - 1;
    const rect:any = this.rects[this.index];
    this.drawCircle(rect.x, rect.y, this.closeEnough);
    this.drawCircle(rect.x + rect.width, rect.y, this.closeEnough);
    this.drawCircle(rect.x + rect.width, rect.y + rect.height, this.closeEnough);
    this.drawCircle(rect.x, rect.y + rect.height, this.closeEnough);
  }

  /*
   * fix rectangle coordinates
   */
  private checkCloseEnough(p1:number, p2:number):boolean {
    return Math.abs(p1 - p2) < this.closeEnough;
  }
  
  /*
   * logic draw rect and image in mouse down time
   */
  public mouseDown(event:MouseEvent):void {
    if(this.streaming === true) return;
    if(this.dataService.getSelected()) {
      this.last_mousex = event.clientX - this.canvasx;
      this.last_mousey = event.clientY - this.canvasy;
      this.mousedown = true;
      this.dataService.getClasses().forEach((clazz:any) => {
        if(clazz.name === this.dataService.getRectParams().name) {
          clazz.number++;
        }
      });    
    }else {
      if(this.rects.length === 0) return;
      this.prevIndex = this.index;
      this.index = this.onSelectRect(event);
      if(this.index === undefined) this.index = this.prevIndex;
      if(this.prevIndex === undefined) this.index = this.rects.length - 1;
      const rect = this.rects[this.index]
      if(rect.width === undefined) {
        rect.x = this.mousey;
        rect.y = this.mousex;
        this.dragBR = true;
      }else if (this.checkCloseEnough(this.mousex, rect.x) && this.checkCloseEnough(this.mousey, rect.y)) {
        this.dragTL = true;
      }else if (this.checkCloseEnough(this.mousex, rect.x + rect.width) && this.checkCloseEnough(this.mousey, rect.y)) {
        this.dragTR = true;
      }else if (this.checkCloseEnough(this.mousex, rect.x) && this.checkCloseEnough(this.mousey, rect.y + rect.height)) {
        this.dragBL = true;
      }else if (this.checkCloseEnough(this.mousex, rect.x + rect.width) && this.checkCloseEnough(this.mousey, rect.y + rect.height)) {
        this.dragBR = true;
      }
      this.onMouseMove(event);
      this.ctx.clearRect(0, 0, this.canvas.style.width, this.canvas.style.height);
      this.drawRectangles();
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.drawRectangles();
    }
  }

  /*
   * logic draw rect and image in mouse up time
   */
  public mouseUp(event:MouseEvent):void {
    if(this.streaming === true) return;
    if(!this.dataService.getSelected()) {
      if(this.rects.length === 0) return;
      this.ctx.fillStyle = environment.RED;
      this.ctx.fillText('please select class', 10, 10); 
      this.dragTL = this.dragTR = this.dragBL = this.dragBR = false;
      this.drawRectangles();
      this.drawHandles();
    }else {
      const width = this.mousex - this.last_mousex;
      const height = this.mousey - this.last_mousey;
      this.rects.push({ x:this.last_mousex, y:this.last_mousey, 
                        width:width, height:height, 
                        realX:event.clientX, realY:event.clientY, 
                        color:this.dataService.getRectParams().color, name:this.dataService.getRectParams().name
                        });         
      if(this.mousex - this.last_mousex < 30 && this.mousey - this.last_mousey < 30 ||
         Math.abs(this.rects[this.rects.length - 1].width) / 30 > Math.abs(this.rects[this.rects.length - 1].height) ||
         Math.abs(this.rects[this.rects.length - 1].height) / 30 > Math.abs(this.rects[this.rects.length - 1].width)
        )
      {
        this.rects.pop();
        this.isClearCanvas = true;
        this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
        if(this.indexForR === 0) this.drawRectangles();
        this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
        this.drawRectangles();
      }                  
      this.mousedown = false;     
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.drawHandles();
      if(this.indexForR === 0) {this.drawRectangles(); return;}
      this.drawRectByIndex(this.indexForR);
    }
  }

  /*
   * logic draw rect and image in mouse move time
   */
  public onMouseMove(event:MouseEvent):void {
    if(this.streaming === true) return;
    if(this.rects.length === 0) this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height)
    this.mousex = event.clientX - this.canvasx;
    this.mousey = event.clientY - this.canvasy;
    if(this.mousedown && this.dataService.getSelected()) {
      this.ctx.beginPath();
      const width = this.mousex - this.last_mousex;
      const height = this.mousey - this.last_mousey;
      this.ctx.rect(this.last_mousex, this.last_mousey, width, height);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.ctx.strokeStyle = this.dataService.getRectParams().color;
      this.ctx.lineWidth = environment.LINE_WIDTH;
      this.ctx.stroke();
      this.ctx.fillStyle = this.dataService.getRectParams().color;
      this.ctx.font = environment.FONT_SIZE;
      if(this.indexForR === 0) this.drawRectangles();
    }
    if(this.rects.length === 0) return;
    else if(!this.dataService.getSelected()) {
      const rect = this.rects[this.index];
      if (this.dragTL) {
        rect.width += rect.x - this.mousex;
        rect.height += rect.y - this.mousey;
        rect.x = this.mousex;
        rect.y = this.mousey;
      }else if(this.dragTR) {
        rect.width = Math.abs(rect.x - this.mousex);
        rect.height += rect.y - this.mousey;
        rect.y = this.mousey;
      }else if(this.dragBL) {
        rect.width += rect.x - this.mousex;
        rect.height = Math.abs(rect.y - this.mousey);
        rect.x = this.mousex;
      }else if (this.dragBR) {
        rect.width = Math.abs(rect.x - this.mousex);
        rect.height = Math.abs(rect.y - this.mousey);
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawRectangles();
      this.ctx.drawImage(this.video.nativeElement, 0, 0, this.canvas.width, this.canvas.height);
      this.drawRectangles();
    }
  }

}
