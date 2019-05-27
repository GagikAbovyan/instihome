import { Component, OnInit, HostListener} from '@angular/core';
import { NgOpenCVService, OpenCVLoadResult } from 'ng-open-cv';
import { tap, switchMap, filter} from 'rxjs/operators';
import { forkJoin, Observable, BehaviorSubject, from } from 'rxjs';
import {DataService} from '../data.service'
import { environment } from './../../environments/environment.prod';
import { Http } from '@angular/http';

@Component({
  selector: 'app-object-track',
  templateUrl: './object-track.component.html',
  styleUrls: ['./object-track.component.scss']
})
export class ObjectTrackComponent implements OnInit {

  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    this.http.get(environment.API_URL + 'close').subscribe((res:any) => {})
  }

  // @HostListener('window:beforeunload', [ '$event' ])
  // beforeUnloadHander(event) {
  //   this.http.get(environment.API_URL + 'close').subscribe((res:any) => {})
  // }

  /*
   * for classes
   */ 
  private className:string;
  public warning:string;
  private prevButtonId:string;
  /*
   * rectangle parametrs
   */
  private firstSelect:boolean = true;
  public classes = this.dataService.getClasses();
  /*
   * Notifies of the ready state of the classifiers load operation
   */
  private classifiersLoaded = new BehaviorSubject<boolean>(false);
  classifiersLoaded$ = this.classifiersLoaded.asObservable();
  /*
   * Inject the NgOpenCVService
   */
  constructor(private ngOpenCVService:NgOpenCVService, public dataService:DataService, private http:Http) {}

  /*
   * initialize some variables
   * load libs
   */
  ngOnInit():void {
    this.dataService.getClasses()[0].color = this.getRandomColor();
    this.dataService.getClasses()[1].color = this.getRandomColor();
    this.loadCV();
    // Always subscribe to the NgOpenCVService isReady$ observer before using a CV related function to ensure that the OpenCV has been
    // successfully loaded
    this.ngOpenCVService.isReady$
      .pipe(
        // The OpenCV library has been successfully loaded if result.ready === true
        filter((result:OpenCVLoadResult) => result.ready),
        switchMap(() => {
          // Load the face and eye classifiers files
          return this.loadClassifiers();
        })
      )
      .subscribe(() => {
        // The classifiers have been succesfully loaded
        this.classifiersLoaded.next(true);
        // console.clear();
      });
    }

  /*
   * generate random colors for classes and rects
   */
  private getRandomColor():string {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  /*
   * set class for rects
   */
  public setClasses(event:any):void {
    if (this.firstSelect) {
      this.firstSelect = false;
    }
    if(document.getElementById(this.prevButtonId) === undefined || null) {
      const selectedButton = document.getElementById(event.name).parentElement;
      selectedButton.className = environment.SELECTED_BUTTON_CLASS;
      this.prevButtonId = event.name;
      this.dataService.setSelected(true);
      return;
    }
    this.dataService.changeRectParams({ name:event.name, color:event.color });
    this.dataService.getClasses().forEach((clazz:any) => {
      if(this.prevButtonId && clazz.name === this.prevButtonId) {
        const prevButton = document.getElementById(this.prevButtonId).parentElement;
        prevButton.className = environment.BUTTON_DEFAULT_CLASS;
      }
    });
    const selectedButton = document.getElementById(event.name).parentElement;
    selectedButton.className = environment.SELECTED_BUTTON_CLASS;
    this.prevButtonId = event.name;
    this.dataService.setSelected(true);
  }

  /*
   * unset selected class
   */
  public unSetClass():void {
    if(document.getElementById(this.prevButtonId) === null) return;
    if(this.firstSelect === true) return;
    const selectedButton = document.getElementById(this.prevButtonId).parentElement;
    selectedButton.className = environment.BUTTON_DEFAULT_CLASS;
    this.dataService.disableClass();
  }

  /*
   * check click
   */
  public checkEvent(event:any) {
    if(event.target.className !== 'annotation-container') return;
    this.unSetClass();
  }

  /*
   * add class
   */
  public addClass():void {
    let isContains:Boolean = false;
    this.dataService.getClasses().forEach((clazz:any) => {
      if(this.className === clazz.name || this.className.length == 0) {
        this.warning = 'this class name already use please input other name';
        isContains = true;
        return;
      }
    });
    if(isContains === true) return;
    this.dataService.getClasses().push({name:this.className, color:this.getRandomColor(), number:0});
    this.warning = '';
  }

  /*
   * pop class
   */
  public popClass(clazz:any):void {
    if(this.dataService.getClasses().length === 1) {
      this.dataService.getClasses().shift();
      this.dataService.setSelected(false); 
      return;
    }
    if(this.dataService.getClasses().indexOf(clazz) === 0) {
      this.dataService.getClasses().shift();
      return;
    }
    this.dataService.getClasses().splice(this.dataService.getClasses().indexOf(clazz), 1);
    if(this.prevButtonId === clazz.name) {
      this.prevButtonId = '';
    }
    if(document.getElementById(clazz.name).parentElement.className === environment.SELECTED_BUTTON_CLASS) {
      this.dataService.setSelected(false);
    }
  }

  /*
   * get input value
   */
  public onSearchChange(searchValue:string):void {  
    this.className = searchValue;
  }

  
  /*
   * add class by enter in keyboard
   */
  public onKeydown(event:KeyboardEvent):void {
    if (event.key === environment.ENTER) this.addClass();
  }
  
  /*
   * load opencv
   */
  private loadClassifiers():Observable<any> {
    return forkJoin(
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_frontalface_default.xml',
        `assets/opencv/data/haarcascades/haarcascade_frontalface_default.xml`
      ),
      this.ngOpenCVService.createFileFromUrl(
        'haarcascade_eye.xml',
        `assets/opencv/data/haarcascades/haarcascade_eye.xml`
      )
    );
  }

  /*
   * load opencv
   */
  private loadCV():void {
    this.ngOpenCVService.isReady$
      .pipe(
        filter((result:OpenCVLoadResult) => result.ready),
        switchMap(() => {
          return this.classifiersLoaded$;
        }),
        tap(() => {
        })
      ).subscribe(() => {});
  }
}
