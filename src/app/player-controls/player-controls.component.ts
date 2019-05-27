import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-player-controls',
  templateUrl: './player-controls.component.html',
  styleUrls: ['./player-controls.component.css']
})
export class PlayerControlsComponent implements OnInit {

  private videoElement:any;

  @ViewChild('video') video: ElementRef;
  constructor() {}

  ngOnInit():void {
    this.videoElement = document.getElementById('video');
    this.changeColors();
  }

  private changeColors():void {
    document.querySelectorAll(".player-progress").forEach(function(item:any) {       
      item.oninput = function() {            
      const valPercent:number = (item.valueAsNumber  - parseInt(item.min)) / (parseInt(item.max) - parseInt(item.min));
        const style = 'background-image:-webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(' 
                      + valPercent + ', #c1282d), color-stop(' + valPercent + ', #f5f6f8));';
        item.style = style;
      };
      item.oninput();
    });
  }

  valueChanged(value){
    console.log(value);
  }

  public play() {
    const playIcon = document.getElementById('play');
    if(playIcon.className === 'fa fa-play-circle') {
      playIcon.className = 'fa fa-pause-circle';
      this.videoElement.play();
    }else {
      playIcon.className = 'fa fa-play-circle';
      this.videoElement.pause();
    }
  }
  
  public stop() {
    this.videoElement.pause();
    this.videoElement.currentTime = '0';
    this.videoElement.play();
  }
}
