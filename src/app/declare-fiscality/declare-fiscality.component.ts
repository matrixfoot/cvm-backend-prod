import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { AlertService } from '../_helpers/alert.service';
import { User } from '../models/user.model';
import Swal from 'sweetalert2';
import { merge, Subscription } from 'rxjs';

@Component({
  selector: 'app-declare-fiscality',
  templateUrl: './declare-fiscality.component.html',
  styleUrls: ['./declare-fiscality.component.scss']
})
export class DeclareFiscalityComponent implements OnInit,OnDestroy {
  isLoggedIn=false
  loading=false;
  errormsg:string;
  natureactivite:string;
  activite:string;
  sousactivite:string;
  regimefiscalimpot:string;
  regimefiscaltva:string;
  matriculefiscale:string;
  currentUser: any;
  user:User;
  standardtraitementsalaireform: FormGroup;
  standardlocationresidentesphysiqueform: FormGroup;
  standardlocationresidentesmoraleform: FormGroup;
  standardlocationnonresidentesphysiquesform: FormGroup;
  standardlocationnonresidentesmoralesform:FormGroup;
  standardhonorairephysiquereelform:FormGroup;
  standardhonorairephysiquenonreelform: FormGroup;
  standardhonorairegroupementsform:FormGroup;
  standardmontant15form: FormGroup;
  standardmontant10form: FormGroup;
  standardmontantindividuelform: FormGroup;
  standardmontantautreform: FormGroup;
  optionValue:any;
  option2Value:any;
  option3Value:any;
  option4Value:any;
  option5Value:any;
  option6Value:any;
  option7Value:any;
  option8Value:any;
  option9Value:any;
  option10Value:any;
  option11Value:any;
  option12Value:any;
  option13Value:any;
  option14Value:any;
  option15Value:any;
  option16Value:any;
  option17Value:any;
  option18Value:any;
  option19Value:any;
  option20Value:any;
  option21Value:any;
  option22Value:any;
  option23Value:any;
  option24Value:any;
  option25Value:any;
  option26Value:any;
  option27Value:any;
  option28Value:any;
  option29Value:any;
  option30Value:any;
  option31Value:any;
  option32Value:any;
  option33Value:any;
  option34Value:any;
  option35Value:any;
  option36Value:any;
  option37Value:any;
  option38Value:any;
  option39Value:any;
  option40Value:any;
  option41Value:any;
  option42Value:any;
  option43Value:any;
  option44Value:any;
  option45Value:any;
  option46Value:any;
  option47Value:any;
  message: string;
  sub1:Subscription
  selectedTab: number = 0;
  retenues: Array<string> = ['location, commission, courtage et vacation', 'traitement et salaires', 'honoraire', 'montant supérieur à 1000 dt', 'Autre'];
  selected = "----"
  showretenuetab=false;
  showtfptab=false;
  showfoprolostab=false;
  showtvatab=false;
  showtimbretab=false;
  showtcltab=false;
  autreform: FormGroup;
  public ammounts: FormArray;
  standardtraitementsalairebrutsalary=0;
  standardtraitementsalaireimposalary=0;
  standardtraitementsalaireretenuesalary=0;
  standardtraitementsalairesolidaritycontribution=0;
  standardlocationresidentesphysiquebrutammount=0;
  standardlocationresidentesphysiqueretenueammount:number;
  standardlocationresidentesphysiquenetammount=0;
  standardlocationresidentesmoralebrutammount=0;
  standardlocationresidentesmoraleretenueammount=0;
  standardlocationresidentesmoralenetammount=0;
  standardlocationnonresidentesphysiquesbrutammount=0;
  standardlocationnonresidentesphysiquesretenueammount=0;
  standardlocationnonresidentesphysiquesnetammount=0;
  standardlocationnonresidentesmoralesbrutammount=0;
  standardlocationnonresidentesmoralesretenueammount=0;
  standardlocationnonresidentesmoralesnetammount=0;
  standardhonorairephysiquereelbrutammount=0;
  standardhonorairephysiquereelretenueammount=0;
  standardhonorairephysiquereelnetammount=0;
  standardhonorairephysiquenonreelbrutammount=0;
  standardhonorairephysiquenonreelretenueammount=0;
  standardhonorairephysiquenonreelnetammount=0;
  standardhonorairegroupementsbrutammount=0;
  standardhonorairegroupementsretenueammount=0;
  standardhonorairegroupementsnetammount=0;
  standardmontant15brutammount=0;
  standardmontant15retenueammount=0;
  standardmontant15netammount=0;
  standardmontant10brutammount=0;
  standardmontant10retenueammount=0;
  standardmontant10netammount=0;
  standardmontantindividuelbrutammount=0;
  standardmontantindividuelretenueammount=0;
  standardmontantindividuelnetammount=0;
  standardmontantautrebrutammount=0;
  standardmontantautreretenueammount=0;
  standardmontantautrenetammount=0;
  constructor(private token: TokenStorageService,private router: Router,private route: ActivatedRoute,
    private alertService: AlertService,private usersservice: UserService,private fb: FormBuilder) {
      this.autreform = this.fb.group({
        ammounts: this.fb.array([ this.createammount() ])
     });
    }
  ngOnInit() {
    
    this.standardtraitementsalaireform =this.fb.group({
      brutsalary: '',
      imposalary: '',
      retenuesalary: '',
      solidaritycontribution: '',
      
      
    });
    this.standardlocationresidentesphysiqueform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.1",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    
    this.standardlocationresidentesmoraleform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.1",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardlocationnonresidentesphysiquesform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.15",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardlocationnonresidentesmoralesform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.15",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardhonorairephysiquereelform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.03",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardhonorairephysiquenonreelform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.1",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardhonorairegroupementsform =this.fb.group({
      brutammount: '',
      quotion: [{value:"0.03",disabled:true}],
      retenueammount: '',
      netammount: '',
      
    });
    this.standardmontant15form =this.fb.group({
      brutammount: '',
      quotion: '',
      retenueammount: '',
      netammount: '',
      
    });
    this.standardmontant10form =this.fb.group({
      brutammount: '',
      quotion: '',
      retenueammount: '',
      netammount: '',
      
    });
    this.standardmontantindividuelform =this.fb.group({
      brutammount: '',
      quotion: '',
      retenueammount: '',
      netammount: '',
      
    });
    this.standardmontantautreform =this.fb.group({
      brutammount: '',
      quotion: '',
      retenueammount: '',
      netammount: '',
      
    });
    this.sub1=merge(
      this.standardlocationresidentesphysiqueform.get('brutammount').valueChanges,
      this.standardlocationresidentesphysiqueform.get('quotion').valueChanges,
      this.standardlocationresidentesphysiqueform.get('netammount').valueChanges,
    ).subscribe((res:any)=>{
      this.calculateResultForm1()
   })
  this.isLoggedIn = !!this.token.getToken();
    
    if (this.isLoggedIn) {
      this.currentUser = this.token.getUser();      
    }
    else (this.router.navigate(['login']));
    
  this.usersservice.getUserById(this.currentUser.userId).then(
          (user: User) => {
            this.loading = false;
            this.user = user;
            this.natureactivite=this.user.natureactivite;
            this.activite=this.user.activite;
            this.sousactivite=this.user.sousactivite;
    
            this.regimefiscalimpot=this.user.regimefiscalimpot;
            this.matriculefiscale=this.user.matriculefiscale;
    if (!user.natureactivite || user.natureactivite=='Autre/null' || !user.activite || user.activite=='Autre/null'
    || user.regimefiscalimpot=='Autre/null'
    || !user.regimefiscalimpot || user.matriculefiscale.length<17) return (this.router.navigate(['complete-profil/'+this.currentUser.userId]))
            
    if (user.regimefiscalimpot=='Réel')
    {
      Swal.fire({
        title: 'Votre régime fiscale en matière d\'impôts directs est le régime réel. Voulez vous établir votre déclaration à travers le module comptabilité?',
        
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'continer avec ce module',
      }).then((result) => {
        if (result.value) {
          
          this.router.navigate(['declare-comptabilite']);
        }

      }).catch(() => {
        Swal.fire('opération non aboutie!');
      });
    }
            
          }
        )
        
      
    
   
  }

  get ammountControls() {
    return this.autreform.get('ammounts')['controls'];
  }
calculateResultForm1()
  {if (this.standardlocationresidentesphysiqueform.get('brutammount').value)
  {
    const brutammount=+this.standardlocationresidentesphysiqueform.get('brutammount').value
    const quotion=+this.standardlocationresidentesphysiqueform.get('quotion').value
    const retenueammount= (brutammount*quotion).toFixed(3);
  
    this.standardlocationresidentesphysiqueform.patchValue({
      retenueammount: retenueammount 
      });
    }
    else {
      const netammount=+this.standardlocationresidentesphysiqueform.get('netammount').value
      const quotion=+this.standardlocationresidentesphysiqueform.get('quotion').value
      const retenueammount= (netammount/((1-quotion)*quotion)).toFixed(3);
  
    this.standardlocationresidentesphysiqueform.patchValue({
      retenueammount: retenueammount 
      });
    }
  }
  ngOnDestroy(){
    this.sub1.unsubscribe()
//    this.sub2.unsubscribe()
  }
  createammount(): FormGroup {
    return this.fb.group({
      title: '',
      ammount: '',
      description: ''
    });
  }

  addammount(): void {
    this.ammounts = this.autreform.get('ammounts') as FormArray;
    this.ammounts.push(this.createammount());
  }

  removeammount(i: number) {
    this.ammounts.removeAt(i);
  }
  logValue() {
    console.log(this.ammounts.value);
  }
  
  onTabClick(event) {
   
  }
  update(e){
    this.selected = e.target.value
  }
  findfiltredretenue(retenues: any[]): any[] {
    
    return retenues.filter(p => p!==this.optionValue);
  }
  findfiltredretenue2(retenues: any[]): any[] {
    
    return retenues.filter(p => p!==this.optionValue&& p!==this.option3Value);
  }
  findfiltredretenue3(retenues: any[]): any[] {
    
    return retenues.filter(p => p!==this.optionValue&& p!==this.option3Value&&p!==this.option19Value);
  }
  findfiltredretenue4(retenues: any[]): any[] {
    
    return retenues.filter(p => p!==this.optionValue&& p!==this.option3Value&&p!==this.option19Value&&p!==this.option29Value);
  }
    myFunction7() {
      var checkbox:any = document.getElementById("myCheck7");
      var checkbox1:any = document.getElementById("myCheck8");
      var checkbox2:any = document.getElementById("myCheck9");
      var checkbox3:any = document.getElementById("myCheck10");
      var checkbox4:any = document.getElementById("myCheck11");
      var checkbox5:any = document.getElementById("myCheck12");
      var checkbox6:any = document.getElementById("myCheck13");
      var text2 = document.getElementById("datelist");
      var text3 = document.getElementById("impotlist");
      var text4 = document.getElementById("tabcontainer");
      if (checkbox.checked == true){
        text2.style.display = "flex";
        text3.style.display = "flex";
      } else {
         text2.style.display = "none";
         text3.style.display = "none";
      }
      if (checkbox1.checked == true || checkbox2.checked==true|| checkbox3.checked==true|| checkbox4.checked==true|| checkbox5.checked==true|| checkbox6.checked==true){
        text4.style.display = "block";
        
      } else {
         text4.style.display = "none";
         
      }
    }
    myFunction5() {
      var checkbox:any = document.getElementById("myCheck5");
      var text2 = document.getElementById("Check7");
      var text3 = document.getElementById("Check6");
      if (checkbox.checked == true){
        text2.style.display = "none";
        text3.style.display = "none";
      } else {
         text2.style.display = "block";
         text3.style.display = "block";
      }
    }
    myFunction8() {
      var checkbox:any = document.getElementById("myCheck8");
      var text2 = document.getElementById("tabcontainer");
      
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showretenuetab=true;
      } else {
         
         this.showretenuetab=false;
      }
    }
    myFunction9() {
      var checkbox:any = document.getElementById("myCheck9");
      var text2 = document.getElementById("tabcontainer");
     
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showtfptab=true;
        
      } else {
         
         this.showtfptab=false;
      }
    }
    myFunction10() {
      var checkbox:any = document.getElementById("myCheck10");
      var text2 = document.getElementById("tabcontainer");
     
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showfoprolostab=true;
        
      } else {
         
         this.showfoprolostab=false;
      }
    }
    myFunction11() {
      var checkbox:any = document.getElementById("myCheck11");
      var text2 = document.getElementById("tabcontainer");
     
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showtvatab=true;
        
      } else {
         
         this.showtvatab=false;
      }
    }
    myFunction12() {
      var checkbox:any = document.getElementById("myCheck12");
      var text2 = document.getElementById("tabcontainer");
     
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showtimbretab=true;
        
      } else {
         
         this.showtimbretab=false;
      }
    }
    myFunction13() {
      var checkbox:any = document.getElementById("myCheck13");
      var text2 = document.getElementById("tabcontainer");
     
      if (checkbox.checked == true){
        text2.style.display = "block";
        this.showtcltab=true;
        
      } else {
         
         this.showtcltab=false;
      }
    }
}


  