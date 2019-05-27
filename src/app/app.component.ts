import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { environment } from 'src/environments/environment.prod';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Puzl';
 
  

  ngOnInit(){
    window.onhashchange = function() {
      console.log('****************************');
      window.location.href = environment.API_URL + 'login';
    }
  }
}
