import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-declare-fiscality',
  templateUrl: './declare-fiscality.component.html',
  styleUrls: ['./declare-fiscality.component.scss']
})
export class DeclareFiscalityComponent implements OnInit {

  loading=false;
  errormsg:string;
  natureactivite:string;
  activite:string;
  sousactivite:string;
  regimefiscalimpot:string;
  regimefiscaltva:string;
  matriculefiscale:string;
  currentUser: any;
  constructor(private token: TokenStorageService,private router: Router,private route: ActivatedRoute,private usersservice: UserService) { }
  ngOnInit() {
    this.currentUser = this.token.getUser();
    console.log(this.currentUser);
    this.natureactivite=this.currentUser.natureactivite;
    this.activite=this.currentUser.activite;
    this.sousactivite=this.currentUser.sousactivite;
    console.log(this.sousactivite);
    this.regimefiscalimpot=this.currentUser.regimefiscalimpot;
    this.matriculefiscale=this.currentUser.matriculefiscale;
    if (!this.natureactivite||!this.activite||!this.sousactivite||!this.regimefiscalimpot||!this.matriculefiscale) return (this.router.navigate(['modify-user/:'+this.currentUser.userId]))
  }
 
}


  