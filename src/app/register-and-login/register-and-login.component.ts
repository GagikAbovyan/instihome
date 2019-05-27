import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Http, RequestOptions } from '@angular/http';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-register-and-login',
  templateUrl: './register-and-login.component.html',
  styleUrls: ['./register-and-login.component.css']
})
export class RegisterAndLoginComponent implements OnInit {

  // @ViewChild('emailReg') emailReg:ElementRef;
  // @ViewChild('passReg') passReg:ElementRef;
  @ViewChild('emailLogin') emailLogin:ElementRef;
  @ViewChild('passLogin') passLogin:ElementRef;
  @HostListener('window:keyup', ['$event'])

  /*
   *  for login or create by Enter
   */
  public keyEvent(event: KeyboardEvent):void {
    if(event.key === environment.ENTER) {
      document.getElementById('btn-log-or-reg').click();
    }
  }

  constructor(private http:Http) {}

  ngOnInit():void {}

  public firstMessage:string = 'Not registered? ';
  public secondMessage:string = 'Create an account';
  public action:string = 'Login';
  public warning:string = '';
  public validate:boolean = true;

  public changeText() {
    if(this.secondMessage === 'Create an account') {
      this.firstMessage = 'Already registered? ';
      this.secondMessage = 'Sign In';
      this.warning = '';
      this.action = 'Create';
      this.emailLogin.nativeElement.value = '';
      this.passLogin.nativeElement.value = '';
    }else {
      this.firstMessage = 'Not registered? ';
      this.secondMessage = 'Create an account';
      this.warning = '';
      this.action = 'Login';
      this.emailLogin.nativeElement.value = '';
      this.passLogin.nativeElement.value = '';
    }
  }

  public loginOrReg():void {
    const innerAction:string = (this.action === 'Login') ? 'sign-in': 'register';
    this.createOrReg(innerAction);
  }

  public onValidateEmail(email:string):void {
    const loginButton:HTMLElement = document.getElementById('btn-log-or-reg');
    const re:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(email.toLowerCase()) === false) {
      this.warning = 'Invalid email';
      this.validate = false;
      loginButton.style.cursor = 'not-allowed';
    }else {
      if(this.passLogin.nativeElement.value.length < 6) {
        this.warning = 'Invalid password';
        this.validate = false;
        loginButton.style.cursor = 'not-allowed';
        return;
      }
      this.warning = '';
      this.validate = true;
      loginButton.style.cursor = 'pointer';
    }
  }

  public onValidatePass(pass:string):void {
    const loginButton:HTMLElement = document.getElementById('btn-log-or-reg');
    if(pass.length < 6) {
      this.warning = 'Invalid password';
      this.validate = false;
      loginButton.style.cursor = 'not-allowed';
    }else {
      const re:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if(re.test(this.emailLogin.nativeElement.value) === false) {
        this.warning = 'Invalid email';
        this.validate = false;
        loginButton.style.cursor = 'not-allowed';
        return;
      }
      this.warning = '';
      this.validate = true;
      loginButton.style.cursor = 'pointer';
    }
  }

  private createOrReg(action:string):void {
    this.warning = '';
    const user = {email:this.emailLogin.nativeElement.value, pass: this.passLogin.nativeElement.value};
    const headers:any = new Headers({ 'Content-Type': 'application/json'});
    const options = new RequestOptions({ headers: headers});
    this.http.post(environment.API_URL + action, user, options)
    .subscribe((res) => {
      const info = JSON.parse(JSON.stringify(res))
      const body = JSON.parse(info._body);
      if(body.success === false) {
        this.warning = 'Invalid email or password';
      }else {
        this.http.get(environment.API_URL + 'user').subscribe((res:any) => {
          const info = JSON.parse(JSON.stringify(res))
          const body = JSON.parse(info._body);
          if(body.action === 'reload') {
            window.location.href = environment.API_URL + 'login';
            window.location.reload();
          }
        });
        window.location.href = environment.API_URL + 'user';
      }
    });
  }
}
