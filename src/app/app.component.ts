import { Component, OnInit,ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { TokenStorageService } from './services/token-storage.service';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  usertype:string;
  currentUser: any;
  isloggedin=false
  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;
  constructor(private token: TokenStorageService,private modalService: BsModalService,private bnIdle: BnNgIdleService,private router: Router) {
    
  }

  ngOnInit() {
    this.currentUser = this.token.getUser();
    this.isloggedin=!!this.token.getToken();
    console.log(this.isloggedin)
    this.usertype=this.currentUser.usertype;
    if (this.isloggedin)
    {
      setTimeout(() => this.childModal.show()
          
      , 780000); 
    this.bnIdle.startWatching(900).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.childModal.hide();
        this.token.signOut();
        this.router.navigate(['login']);
        this.reloadPage()
      }
    });
  }
  }
  hideChildModal(): void {
    this.childModal.hide();
  }
  stay() {
    this.childModal.hide();
    this.reset();
    setTimeout(() => this.childModal.show()
          
      , 780000)
  }
  reset() {
    this.bnIdle.resetTimer()
  }
  logout() {
    this.childModal.hide();
    this.token.signOut();
    this.router.navigate(['login']);
    this.reloadPage()
  }
  reloadPage (){
    setTimeout(() => window.location.reload(), 1000);
    
    
  }
}
