import { Component, OnInit, OnDestroy, HostListener, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenStorageService } from '../services/token-storage.service';
import { UserService } from '../services/user.service';
import { DeccomptabiliteService } from '../services/dec-comptabilite';
import { AlertService } from '../_helpers/alert.service';
import { User } from '../models/user.model';
import { Deccomptabilite } from '../models/dec-comptabilite';
import Swal from 'sweetalert2';
import { merge, Subject, Subscription } from 'rxjs';
import { ComponentCanDeactivate  } from '../services/component-can-deactivate';
import { stringify } from 'querystring';
@Component({
  selector: 'app-declare-comptabilite',
  templateUrl: './declare-comptabilite.component.html',
  styleUrls: ['./declare-comptabilite.component.scss']
})
export class DeclareComptabiliteComponent extends ComponentCanDeactivate implements OnInit,OnDestroy {
  fileUploaded = false;
  isLoggedIn=false
  loading=false;
  showeditionnote=false;
  showrecettejour=false
  showrelevemanuel=false;
  showrelevejoint=false
  showpaiemanuel=false
  showcatab=false
  showachattab=false
  showbanquetab=false
  showsalairetab=false
  showinvoiceform=false
  errormsg:string;
  natureactivite:string;
  activite:string;
  sousactivite:string;
  regimefiscalimpot:string;
  regimefiscaltva:string;
  matriculefiscale:string;
  currentUser: any;
  user:User;
  choixfacture:string;
  option1Value:string
  option2Value:string
  option3Value=false
  option4Value=false
  option5Value=false
  option6Value=false
  option7Value:string
  totalht=0.000
  totaltva=0.000
  totaldt=0.000
  totalttc=0.000
  totalht2=0.000
  totaltva2=0.000
  totaldt2=0.000
  totalttc2=0.000
  totalrecette=0.000
  totalht3=0.000
  totaltva3=0.000
  totaldt3=0.000
  totalttc3=0.000
  totaldebit=0.000
  totalcredit=0.000
  totalsoldemois=0.000
  totalsalairebrut=0.000
  totalcnss=0.000
  totalsalaireimposable=0.000
  totalretenueimpot=0.000
  totalavancepret=0.000
  totalsalairenet=0.000
  editionnoteform: FormGroup;
  public ammounts: FormArray;
  recettejournaliereform: FormGroup;
  public ammounts2: FormArray;
  factureachatform: FormGroup;
  public ammounts3: FormArray;
  relevemanuelform: FormGroup;
  public ammounts4: FormArray;
  relevejointform: FormGroup;
  public ammounts5: FormArray;
  salaireform: FormGroup;
  public ammounts6: FormArray;
  private destroyed$ = new Subject<void>();

  constructor(
    private token: TokenStorageService,private router: Router,private route: ActivatedRoute,
    private alertService: AlertService,private usersservice: UserService,private DeccomptabiliteService :DeccomptabiliteService,private fb: FormBuilder
  ) {
    super();
    this.editionnoteform = this.fb.group({
      ammounts: this.fb.array([ this.createammount() ])
   });
   
   this.recettejournaliereform = this.fb.group({
    ammounts2: this.fb.array([ this.createammount2() ])
 });
 this.factureachatform = this.fb.group({
  ammounts3: this.fb.array([ this.createammount3() ])
});
this.relevemanuelform = this.fb.group({
  ammounts4: this.fb.array([ this.createammount4() ])
});
this.relevejointform = this.fb.group({
  ammounts5: this.fb.array([ this.createammount5() ])
});
this.salaireform = this.fb.group({
  ammounts6: this.fb.array([ this.createammount6() ])
});
   }
  
 
  ngOnInit() {
    //verify user loggedin or redirect to login
    this.isLoggedIn = !!this.token.getToken();
  if (this.isLoggedIn) {
    this.currentUser = this.token.getUser();      
  }
  else return (
    this.token.saved=true,
    this.router.navigate(['login']));
//verify user choice about method of declaring invoices
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
  
  }
)

  }
  canDeactivate():boolean {  
    
    if(this.token.saved)
    {
      return true;
    }
    return false;
  }
  //verify doublons fichier comptable 
  verify(e)
  {
    this.loading=true
    this.DeccomptabiliteService.geexistenttdeccomptabilite(this.currentUser.userId,this.option1Value,this.option2Value).then(
      (data:Deccomptabilite[]) => {
        
        if (data.length>0)
        {
          Swal.fire({
            title: 'vous avez déjà un fichier comptable qui existe avec ce mois et cette année, veuillez choisir entre les alternatives suivantes:',
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Modifier le fichier existant',
            cancelButtonText: 'Modifier le mois',
          }).then((result) => 
          {
            if (result.value) {
            
              this.router.navigate(['modify-deccomptabilite/'+data[0]._id])

  this.loading=false
            }
            else{
              this.loading=false
             this.option2Value=''
  
            }
          }).catch(() => {
            this.loading=false
            Swal.fire('opération non aboutie!')
          })
        }
        else{
this.loading=false
          var text3 = document.getElementById("datalist");
          var text4 = document.getElementById("datelist");

          text3.style.display = "block";
          text4.style.display = "none";

          
        }
      }
      
    )
   

  }
  onTabClick(event) {
   
  }
  setThreeNumberDecimal($event) {
    $event.target.value = $event.target.value ? $event.target.value : 0;
    $event.target.value = parseFloat($event.target.value).toFixed(3);
  }
  setdate(i: number) {
  let ammounts = this.editionnoteform.get('ammounts') as FormArray;
   const j= this.editionnoteform.get('ammounts').value.at(i).jour
   if (j>31)
   return (alert('veuillez entrer un jour valide'),ammounts.at(i).patchValue({
    jour:''
   }))
   const date=j+'/'+this.option2Value+'/'+this.option1Value
   ammounts.at(i).patchValue({
    date:date
   })
 
  }
  setdate2(i: number) {
    let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
     const j= this.recettejournaliereform.get('ammounts2').value.at(i).jour
     if (j>31)
     return (alert('veuillez entrer un jour valide'),ammounts2.at(i).patchValue({
      jour:''
     }))
     const date=j+'/'+this.option2Value+'/'+this.option1Value
     ammounts2.at(i).patchValue({
      date:date
     })
   
    }
    setdate3(i: number) {
      let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
       const j= this.factureachatform.get('ammounts3').value.at(i).jour
       if (j>31)
       return (alert('veuillez entrer un jour valide'),ammounts3.at(i).patchValue({
        jour:''
       }))
       const date=j+'/'+this.option2Value+'/'+this.option1Value
       ammounts3.at(i).patchValue({
        date:date
       })
     
      }
      setdate4(i: number) {
        let ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
         const j= this.relevemanuelform.get('ammounts4').value.at(i).jour
         if (j>31)
         return (alert('veuillez entrer un jour valide'),ammounts4.at(i).patchValue({
          jour:''
         }))
         const date=j+'/'+this.option2Value+'/'+this.option1Value
         ammounts4.at(i).patchValue({
          date:date
         })
       
        }
        setdate5(i: number) {
          let ammounts5 = this.relevejointform.get('ammounts5') as FormArray;
           const j= this.relevejointform.get('ammounts5').value.at(i).jour
           if (j>31)
           return (alert('veuillez entrer un jour valide'),ammounts5.at(i).patchValue({
            jour:''
           }))
           const date=j+'/'+this.option2Value+'/'+this.option1Value
           ammounts5.at(i).patchValue({
            date:date
           })
         
          }
          setdate6(i: number) {
            let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
             const j= this.salaireform.get('ammounts6').value.at(i).jour
             if (j>31)
             return (alert('veuillez entrer un jour valide'),ammounts6.at(i).patchValue({
              jour:''
             }))
             const date=j+'/'+this.option2Value+'/'+this.option1Value
             ammounts6.at(i).patchValue({
              date:date
             })
           
            }
  settva(i: number) {
    let ammounts = this.editionnoteform.get('ammounts') as FormArray;
     const mht= this.editionnoteform.get('ammounts').value.at(i).montantht
     console.log(mht)
     
     const montanttva=(mht*0.13).toFixed(3)
     ammounts.at(i).patchValue({
      montanttva:montanttva
     })
   
    }
    settva2(i: number) {
      let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
       const mht= this.recettejournaliereform.get('ammounts2').value.at(i).montantht
       console.log(mht)
       
       const montanttva=(mht*0.13).toFixed(3)
       ammounts2.at(i).patchValue({
        montanttva:montanttva
       })
     
      }
      settva3(i: number) {
        let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
         const mht= this.factureachatform.get('ammounts3').value.at(i).montantht
         console.log(mht)
         
         const montanttva=(mht*0.13).toFixed(3)
         ammounts3.at(i).patchValue({
          montanttva:montanttva
         })
       
        }
    setht(i: number) {
      let ammounts = this.editionnoteform.get('ammounts') as FormArray;
       const mttc= this.editionnoteform.get('ammounts').value.at(i).montantttc
       const mdt= this.editionnoteform.get('ammounts').value.at(i).montantdt

       console.log()
       
       const montantht=+((mttc-mdt)/1.13).toFixed(3)
       const montanttva=(mttc-mdt-montantht).toFixed(3)
       ammounts.at(i).patchValue({
        montantht:montantht,
        montanttva:montanttva
       })
     
      }
      setht2(i: number) {
        let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
         const mrecette= +this.recettejournaliereform.get('ammounts2').value.at(i).recette
         const mtimbre= +this.recettejournaliereform.get('ammounts2').value.at(i).montantdt
         console.log()
         const montantttc=+(mrecette-mtimbre).toFixed(3) 
         const montantht=+((+montantttc)/1.13).toFixed(3)
         const montanttva=+(montantttc-montantht).toFixed(3)
         console.log(montantttc)
         ammounts2.at(i).patchValue({
          montantht:montantht,
          montanttva:montanttva,
          montantttc:montantttc
         })
         this.totalht2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantht || 0);
          return acc;
        },0);
        this.totaltva2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montanttva || 0);
          return acc;
        },0);
        this.totaldt2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantdt || 0);
          return acc;
        },0);
        this.totalttc2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantttc || 0);
          return acc;
        },0);
        this.totalrecette = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.recette || 0);
          return acc;
        },0);
        }
        setht3(i: number) {
          let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
           const mttc= this.factureachatform.get('ammounts3').value.at(i).montantttc
           const mdt= this.factureachatform.get('ammounts3').value.at(i).montantdt

           console.log()
           
           const montantht=+((mttc-mdt)/1.13).toFixed(3)
           const montanttva=+(mttc-montantht-mdt).toFixed(3)
           const montantdt=(mttc-montantht-montanttva).toFixed(3)

           ammounts3.at(i).patchValue({
            montantht:montantht,
            montanttva:montanttva,
            montantdt:montantdt,

           })
           this.totalht3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantht || 0);
            return acc;
          },0);
          this.totaltva3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montanttva || 0);
            return acc;
          },0);
          this.totaldt3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantdt || 0);
            return acc;
          },0);
          this.totalttc3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantttc || 0);
            return acc;
          },0);
          }
    setttc(i: number) {
      let ammounts = this.editionnoteform.get('ammounts') as FormArray;
       const mht= +(this.editionnoteform.get('ammounts').value).at(i).montantht
       const mtva= (this.editionnoteform.get('ammounts').value.at(i).montanttva)
       const mdt= +(this.editionnoteform.get('ammounts').value).at(i).montantdt

       console.log(mht)
       
       const montantttc=(mht+ +mtva+mdt).toFixed(3)

       ammounts.at(i).patchValue({
        montantttc:montantttc
       })
     
      }
      setttc2(i: number) {
        let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
         const mht= +(this.recettejournaliereform.get('ammounts2').value).at(i).montantht
         const mtva= (this.recettejournaliereform.get('ammounts2').value.at(i).montanttva)
         const mdt= +(this.recettejournaliereform.get('ammounts2').value).at(i).montantdt
  
         console.log(mht)
         
         const montantttc=(mht+ +mtva+mdt).toFixed(3)
  
         ammounts2.at(i).patchValue({
          montantttc:montantttc
         })
       
        }
        setttc3(i: number) {
          let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
           const mht= +(this.factureachatform.get('ammounts3').value).at(i).montantht
           const mtva= (this.factureachatform.get('ammounts3').value.at(i).montanttva)
           const mdt= +(this.factureachatform.get('ammounts3').value).at(i).montantdt
    
           console.log(mht)
           
           const montantttc=(mht+ +mtva+mdt).toFixed(3)
    
           ammounts3.at(i).patchValue({
            montantttc:montantttc
           })
           this.totalht3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantht || 0);
            return acc;
          },0);
          this.totaltva3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montanttva || 0);
            return acc;
          },0);
          this.totaldt3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantdt || 0);
            return acc;
          },0);
          this.totalttc3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
            acc += +(curr.montantttc || 0);
            return acc;
          },0);
          }
          setimposable(i: number) {
            let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
             const mbrut= +(this.salaireform.get('ammounts6').value).at(i).salairebrut
             const mcnss= (this.salaireform.get('ammounts6').value.at(i).montantcnss)
      
             
             const montantimposable=(+mbrut- +mcnss).toFixed(3)
      
             ammounts6.at(i).patchValue({
              montantimposable:montantimposable
             })
           
            }
            setnet(i: number) {
              let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
               const mimposable= +(this.salaireform.get('ammounts6').value).at(i).montantimposable
               const mretenue= +(this.salaireform.get('ammounts6').value.at(i).montantretenue)
               const mavance= +(this.salaireform.get('ammounts6').value).at(i).montantavance
               const mabrut= +(this.salaireform.get('ammounts6').value).at(i).salairebrut
               const mcnss= +(this.salaireform.get('ammounts6').value).at(i).montantcnss

               
               const salairenet=(+mabrut- +mcnss- +mretenue- +mavance).toFixed(3)
        
               ammounts6.at(i).patchValue({
                salairenet:salairenet
               })
             
              }
              setbrut(i: number) {
                let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
                const mimposable= +(this.salaireform.get('ammounts6').value).at(i).montantimposable
               const mretenue= +(this.salaireform.get('ammounts6').value.at(i).montantretenue)
               const mavance= +(this.salaireform.get('ammounts6').value).at(i).montantavance
               const mcnss= +(this.salaireform.get('ammounts6').value.at(i).montantcnss)

          
                 
                 const salairebrut=(+mimposable+ +mretenue+ +mavance+ +mcnss).toFixed(3)
          
                 ammounts6.at(i).patchValue({
                  salairebrut:salairebrut
                 })
               
                }
      onChange(i: number){
        const totalht = (this.editionnoteform.get('ammounts').value.at(i).montantht || 0)
        const totaltva = (this.editionnoteform.get('ammounts').value.at(i).montanttva || 0)
        const totaldt = (this.editionnoteform.get('ammounts').value.at(i).montantdt || 0)
        const totalttc = (this.editionnoteform.get('ammounts').value.at(i).montantttc || 0)

        this.totalht = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
          acc += +(curr.montantht || 0);
          return acc;
        },0);
        this.totaltva = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
          acc += +(curr.montanttva || 0);
          return acc;
        },0);
        this.totaldt = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
          acc += +(curr.montantdt || 0);
          return acc;
        },0);
        this.totalttc = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
          acc += +(curr.montantttc || 0);
          return acc;
        },0);
      }
      onChange2(i: number){
        

        this.totalht2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantht || 0);
          return acc;
        },0);
        this.totaltva2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montanttva || 0);
          return acc;
        },0);
        this.totaldt2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantdt || 0);
          return acc;
        },0);
        this.totalttc2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
          acc += +(curr.montantttc || 0);
          return acc;
        },0);
      }
      onChange3(i: number){
        

        this.totalht3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
          acc += +(curr.montantht || 0);
          return acc;
        },0);
        this.totaltva3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
          acc += +(curr.montanttva || 0);
          return acc;
        },0);
        this.totaldt3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
          acc += +(curr.montantdt || 0);
          return acc;
        },0);
        this.totalttc3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
          acc += +(curr.montantttc || 0);
          return acc;
        },0);
      }
      onChange4(i: number){
        

        this.totaldebit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
          acc += +(curr.debit || 0);
          return acc;
        },0);
        this.totalcredit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
          acc += +(curr.credit || 0);
          return acc;
        },0);
        this.totalsoldemois = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
          acc += +(curr.credit - curr.debit || 0);
          return acc;
        },0);
      }
      onChange6(i: number){
        

        this.totalsalairebrut = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.salairebrut || 0);
          return acc;
        },0);
        this.totalcnss = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.montantcnss || 0);
          return acc;
        },0);
        this.totalsalaireimposable = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.montantimposable || 0);
          return acc;
        },0);
        this.totalretenueimpot = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.montantretenue || 0);
          return acc;
        },0);
        this.totalavancepret = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.montantavance || 0);
          return acc;
        },0);
        this.totalsalairenet = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
          acc += +(curr.salairenet || 0);
          return acc;
        },0);
      }
  keyPressNumbers(event) {
    var charCode = (event.which) ? event.which : event.keyCode;
    // Only Numbers 0-9
    if ((charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }
  //Ajout de formulaire de création  edition note + recette journaliere
  get ammountControls() {
    return this.editionnoteform.get('ammounts')['controls'];
  }
  get ammountControls2() {
    return this.recettejournaliereform.get('ammounts2')['controls'];
  }
  get ammountControls3() {
    return this.factureachatform.get('ammounts3')['controls'];
  }
  get ammountControls4() {
    return this.relevemanuelform.get('ammounts4')['controls'];
  }
  get ammountControls5() {
    return this.relevejointform.get('ammounts5')['controls'];
  }
  get ammountControls6() {
    return this.salaireform.get('ammounts6')['controls'];
  }
  createammount() 
  : FormGroup {
    
      return this.fb.group({
        type:'1',
        jour: '',
        date: '',
        numeronote: '',
        montantht:'0',
        montanttva:'0',
        montantdt:'0.600',
        montantttc:'0',
        reglement:'',

  
      });
    }
  createammount2() 
  : FormGroup {
    
    return  this.fb.group({
      type:'2',
      jour: '',
      date: '',
      recette:'',
      montantht:'0',
      montanttva:'0',
      montantdt:'0.600',
      montantttc:'0',

    });
  }
  createammount3() 
  : FormGroup {
    
    return  this.fb.group({
      type:'3',
      jour: '',
      date: '',
      fournisseur:'',
      autrefournisseur:'',
      numerofacture:'',
      natureachat:'',
      autrenatureachat:'',
      montantht:'0',
      montanttva:'0',
      montantdt:'0',
      montantttc:'0',
      reglement:'',
      image:''

    });
  }
  createammount4() 
  : FormGroup {
    
    return  this.fb.group({
      type:'4',
      jour: '',
      date: '',
      debit:'0',
      credit:'0',
    });
  }
  createammount5() 
  : FormGroup {
    
    return  this.fb.group({
      type:'5',
      jour: '',
      date: '',
      image:''
    });
  }
  createammount6() 
  : FormGroup {
    
    return  this.fb.group({
      type:'6',
      matricule: '',
      nomprenom: '',
      salairebrut:'0',
      montantcnss:'0',
      montantimposable:'0',
      montantretenue:'0',
      montantavance:'0',
      salairenet:'0',
      reglement:'0',
      image:'0'
    });
  }
   addammount(){
    this.ammounts = this.editionnoteform.get('ammounts') as FormArray;
    this.ammounts.push(this.createammount());
    const i=this.ammounts.length
    this.ammounts.at(i-1).patchValue({
      numeronote:+(this.user.numeronote)+i-1
     })
     this.totalht = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantht || 0);
      return acc;
    },0);
    this.totaltva = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montanttva || 0);
      return acc;
    },0);
    this.totaldt = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantdt || 0);
      return acc;
    },0);
    this.totalttc = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantttc || 0);
      return acc;
    },0);
  }
  addammount2(): void {
    this.ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
    this.ammounts2.push(this.createammount2());
  }
  addammount3(){
    this.ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
    this.ammounts3.push(this.createammount3());
     this.totalht3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantht || 0);
      return acc;
    },0);
    this.totaltva3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montanttva || 0);
      return acc;
    },0);
    this.totaldt3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantdt || 0);
      return acc;
    },0);
    this.totalttc3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantttc || 0);
      return acc;
    },0);
  }
  addammount4(): void {
    this.ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
    this.ammounts4.push(this.createammount4());
    this.totaldebit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(curr.montantdebit || 0);
      return acc;
    },0);
    this.totalcredit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(curr.montantcredit || 0);
      return acc;
    },0);
    this.totalsoldemois = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(this.totalcredit - this.totaldebit || 0);
      return acc;
    },0);
  }
  addammount5(){
    this.ammounts5 = this.relevejointform.get('ammounts5') as FormArray;
    this.ammounts5.push(this.createammount5());
   
  }
  addammount6(){
    this.ammounts6 = this.salaireform.get('ammounts6') as FormArray;
    this.ammounts6.push(this.createammount6());
    this.totalsalairebrut = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.salairebrut || 0);
      return acc;
    },0);
    this.totalcnss = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantcnss || 0);
      return acc;
    },0);
    this.totalsalaireimposable = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantimposable || 0);
      return acc;
    },0);
    this.totalretenueimpot = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantretenue || 0);
      return acc;
    },0);
    this.totalavancepret = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantavance || 0);
      return acc;
    },0);
    this.totalsalairenet = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.salairenet || 0);
      return acc;
    },0);
  }
  removeammount(i: number) {
    this.ammounts.removeAt(i);
    this.totalht = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantht || 0);
      return acc;
    },0);
    this.totaltva = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montanttva || 0);
      return acc;
    },0);
    this.totaldt = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantdt || 0);
      return acc;
    },0);
    this.totalttc = +(this.editionnoteform.get('ammounts').value).reduce((acc,curr)=>{
      acc += +(curr.montantttc || 0);
      return acc;
    },0);
  }
  removeammount2(i: number) {
    this.ammounts2.removeAt(i);
    this.totalht2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
      acc += +(curr.montantht || 0);
      return acc;
    },0);
    this.totaltva2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
      acc += +(curr.montanttva || 0);
      return acc;
    },0);
    this.totaldt2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
      acc += +(curr.montantdt || 0);
      return acc;
    },0);
    this.totalttc2 = +(this.recettejournaliereform.get('ammounts2').value).reduce((acc,curr)=>{
      acc += +(curr.montantttc || 0);
      return acc;
    },0);
  }
  removeammount3(i: number) {
    this.ammounts3.removeAt(i);
    this.totalht3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantht || 0);
      return acc;
    },0);
    this.totaltva3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montanttva || 0);
      return acc;
    },0);
    this.totaldt3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantdt || 0);
      return acc;
    },0);
    this.totalttc3 = +(this.factureachatform.get('ammounts3').value).reduce((acc,curr)=>{
      acc += +(curr.montantttc || 0);
      return acc;
    },0);
  }
  removeammount4(i: number) {
    this.ammounts4.removeAt(i);
    this.totaldebit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(curr.montantdebit || 0);
      return acc;
    },0);
    this.totalcredit = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(curr.montantcredit || 0);
      return acc;
    },0);
    this.totalsoldemois = +(this.relevemanuelform.get('ammounts4').value).reduce((acc,curr)=>{
      acc += +(this.totalcredit - this.totaldebit || 0);
      return acc;
    },0);
  }
  removeammount5(i: number) {
    this.ammounts3.removeAt(i);
    
  }
  removeammount6(i: number) {
    this.ammounts6.removeAt(i);
    this.totalsalairebrut = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.salairebrut || 0);
      return acc;
    },0);
    this.totalcnss = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantcnss || 0);
      return acc;
    },0);
    this.totalsalaireimposable = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantimposable || 0);
      return acc;
    },0);
    this.totalretenueimpot = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantretenue || 0);
      return acc;
    },0);
    this.totalavancepret = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.montantavance || 0);
      return acc;
    },0);
    this.totalsalairenet = +(this.salaireform.get('ammounts6').value).reduce((acc,curr)=>{
      acc += +(curr.salairenet || 0);
      return acc;
    },0);
  }
  //resetformsfunctions
  restartform()
  {
    this.loading = true;
    let ammounts = this.editionnoteform.get('ammounts') as FormArray;
    let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
    if(ammounts)
    {    ammounts.reset()
      for (let i = 1; i < ammounts.length; i++)
    {
this.removeammount(i)
    }
      this.totalht=0.000
      this.totaltva=0.000
      this.totaldt=0.000
      this.totalttc=0.000
    }
    else if (ammounts2)
    {
      ammounts2.reset()
      this.totalht2=0.000
      this.totaltva2=0.000
      this.totaldt2=0.000
      this.totalttc2=0.000
    }
    let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
    ammounts3.reset()
    for (let i = 1; i < ammounts3.length; i++)
    {
this.removeammount3(i)
    }
    this.totalht3=0.000
      this.totaltva3=0.000
      this.totaldt3=0.000
      this.totalttc3=0.000
      let ammounts5 = this.relevejointform.get('ammounts5') as FormArray;
      let ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
      ammounts4.reset()
      ammounts5.reset()
      for (let i = 1; i < ammounts5.length; i++)
      {
  this.removeammount5(i)
      }
  this.totaldebit=0.000
  this.totalcredit=0.000
  this.totalsoldemois=0.000
  let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
  ammounts6.reset()
  this.totalsalairebrut=0.000
  this.totalcnss=0.000
  this.totalsalaireimposable=0.000
  this.totalretenueimpot=0.000
  this.totalavancepret=0.000
  this.totalsalairenet=0.000
  for (let i = 1; i < ammounts6.length; i++)
  {
this.removeammount6(i)
  }
  this.loading=false

  }
  resetcaall()
  {
    let ammounts = this.editionnoteform.get('ammounts') as FormArray;
    let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
    if(ammounts)
    {    ammounts.reset()
      for (let i = 1; i < ammounts.length; i++)
    {
this.removeammount(i)
    }
      this.totalht=0.000
      this.totaltva=0.000
      this.totaldt=0.000
      this.totalttc=0.000
    }
    else if (ammounts2)
    {
      ammounts2.reset()
      this.totalht2=0.000
      this.totaltva2=0.000
      this.totaldt2=0.000
      this.totalttc2=0.000
    }

  }
  resetachatall()
  {
    let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
    ammounts3.reset()
    for (let i = 1; i < ammounts3.length; i++)
    {
this.removeammount3(i)
    }
    this.totalht3=0.000
      this.totaltva3=0.000
      this.totaldt3=0.000
      this.totalttc3=0.000

  }
  resetbanqueall()
  {
    let ammounts5 = this.relevejointform.get('ammounts5') as FormArray;
    let ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
    ammounts4.reset()
    ammounts5.reset()
    for (let i = 1; i < ammounts5.length; i++)
    {
this.removeammount5(i)
    }
this.totaldebit=0.000
this.totalcredit=0.000
this.totalsoldemois=0.000

  }
  resetsalaireall()
  {
    let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
    ammounts6.reset()
    this.totalsalairebrut=0.000
    this.totalcnss=0.000
    this.totalsalaireimposable=0.000
    this.totalretenueimpot=0.000
    this.totalavancepret=0.000
    this.totalsalairenet=0.000
    for (let i = 1; i < ammounts6.length; i++)
    {
this.removeammount6(i)
    }
  }
 
  logValue() {
    for (let i = 0; i < this.editionnoteform.get('ammounts').value.length; i++)
      {
        if (this.editionnoteform.get('ammounts').value.at(i).montantht==='0')
{
  this.removeammount(i)
}
      }
      console.log(this.editionnoteform.get('ammounts').value)
 
  }
  logValue2() {
    console.log(this.ammounts2);

    console.log(this.recettejournaliereform.get('ammounts2').value);
  }
  logValue3() {
    console.log(this.ammounts2);

    console.log(this.factureachatform.get('ammounts3').value);
  }
  logValue4() {
    for (let i = 0; i < this.ammounts4.length; i+=1)
      {
        if (this.ammounts4.value.at(i).debit==='0' && this.ammounts4.value.at(i).debit==='')
{
  this.removeammount4(i)
}
      }
      console.log(this.ammounts4.value)
  }
  logValue5() {
    console.log(this.ammounts5);

    console.log(this.relevejointform.get('ammounts5').value);
  }
  logValue6() {
    console.log(this.ammounts6);

    console.log(this.salaireform.get('ammounts6').value);
  }
  //save method
  onSubmit() {
    this.loading = true;
    const deccomptabilite:Deccomptabilite = new Deccomptabilite();
    deccomptabilite.userId = this.currentUser.userId;
    deccomptabilite.codedeclaration='';
    deccomptabilite.nature='déclaration comptable';
    deccomptabilite.annee=this.option1Value
    deccomptabilite.mois=this.option2Value
    if(this.option1Value==''||this.option2Value=='')
    {
      return (
        Swal.fire({
        title: 'veuillez indiquer le mois et l\'année de la déclaration',
        icon: 'error',
        confirmButtonColor: '#3085d6',
      }).then((result) => {this.loading=false
      }).catch(() => {
        Swal.fire('opération non aboutie!')
      }))
    }
    if (this.option3Value) 
    {
      let ammounts = this.editionnoteform.get('ammounts') as FormArray;
      for (let i = 0; i < ammounts.length; i++)
      {
        if (ammounts.value.at(i).montantht==='0'&&ammounts.value.at(i).montantht==='')
{
  this.removeammount(i)
}
      } 
      deccomptabilite.autre1=ammounts.value
      let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
      for (let i = 0; i < ammounts2.length; i+=1)
      {
        if (ammounts2.value.at(i).recette==='0'&&ammounts2.value.at(i).recette==='')
{
  this.removeammount2(i)
}
      } 
      deccomptabilite.autre2=ammounts2.value
    }
    if (this.option4Value) 
    {
      let ammounts3 = this.factureachatform.get('ammounts3') as FormArray;
      for (let i = 0; i < ammounts3.length; i++)
      {
        if (ammounts3.value.at(i).montantht==='0'&&ammounts3.value.at(i).montantht==='')
{
  this.removeammount3(i)
}
      } 
      deccomptabilite.autre3=ammounts3.value
    }
        if (this.option5Value) 
{
  let ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
  for (let i = 0; i < ammounts4.length; i+=1)
  {
    if (ammounts4.value.at(i).debit==='0' && ammounts4.value.at(i).debit==='')
{
this.removeammount4(i)
}
  } 
  deccomptabilite.autre4=ammounts4.value
  let ammounts5 = this.relevejointform.get('ammounts5') as FormArray;
  for (let i = 1; i < ammounts5.length; i++)
  {
    if (ammounts5.value.at(i).date==='')
{
this.removeammount5(i)
}
  } 
  deccomptabilite.autre5=ammounts5.value
}
if (this.option6Value) 
{
  let ammounts6 = this.salaireform.get('ammounts6') as FormArray;
  for (let i = 0; i < ammounts6.length; i+=1)
  {
    if (ammounts6.value.at(i).salairebrut==='0'&&ammounts6.value.at(i).salairebrut==='')
{
this.removeammount6(i)
}
  } 
  deccomptabilite.autre6=ammounts6.value
}
    this.DeccomptabiliteService.createwithoutfile(deccomptabilite).then(
      (data:any) => {
        this.token.saved=true;
        this.loading = false;
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'déclaration sauvegardée avec succès! un email vous a été envoyer pour confirmer la réception de votre déclaration. vous pouvez désormais modifier/compléter votre déclaration à travers votre tableau de bord',
          showConfirmButton: false,
          timer: 6000 
        });
        this.router.navigate(['modify-deccomptabilite/'+data.data._id])
      },
      (error) => {
        this.loading = false;
        
      }
    ) 
  }
  //datalistfunctions
  myFunction1() {
    var checkbox:any = document.getElementById("myCheck1");
    var text2 = document.getElementById("tabcontainer");
    if (checkbox.checked == true){
      text2.style.display = "block";
      this.showcatab=true;
      this.option3Value=true;
//verify user choice about method of declaring invoices
this.usersservice.getUserById(this.currentUser.userId).then(
  async (user: User) => {
    this.loading = false;
    this.user = user;
  //vérification du renseignement de la méthode de décalaration du chiffre d'affaire  
if (!user.choixfacture)
{
Swal.fire({
title: 'Veuillez choisir le mode de déclaration du chiffre d\'affaire. Notez que ce choix effectué ne peut être changé que suite à une demande au cabinet MaCompta',

icon: 'info',
showDenyButton: true,
showCancelButton: true,
confirmButtonColor: '#3085d6',
cancelButtonColor: '#555',
confirmButtonText: 'Edition des notes d\'honoraire',
cancelButtonText: 'Annuler',
denyButtonText: 'Saisie des recettes journalières',

}).then((result) => {
if (result.isConfirmed) {
  this.choixfacture='edition note'
  const newuser= new User
  newuser.choixfacture=this.choixfacture
  this.token.saved=true
  this.usersservice.completeUserById(user._id,newuser).then(
    () => {
      this.reloadPage();
    }
  )
}
else if (result.isDenied)
{
  this.choixfacture='saisie recette'
  const newuser= new User
  newuser.choixfacture=this.choixfacture
  this.token.saved=true
  this.usersservice.completeUserById(user._id,newuser).then(
    () => {
      this.reloadPage();
    }
  )
}

}).catch(() => {
Swal.fire('opération non aboutie!');
});
}
if (user.choixfacture=='edition note')
{
  if(!user.numeronote)
  {
const { value: numero } = await Swal.fire({
  title: 'Renseigner votre 1er numéro de note d\'honoraire',
  input: 'text',
  inputLabel: '1er numéro de note',
  inputValue: '',
  showCancelButton: true,
  inputValidator: (value) => {
    if (!value) {
      return 'Vous devez renseigner une valeur!'
    }
  }
})

if (numero) {
  Swal.fire(`votre premier numéro est ${numero}`)
  const newuser= new User
  newuser.numeronote=numero
  this.token.saved=true
  this.usersservice.completeUserById(user._id,newuser).then(
    () => {
      this.reloadPage();
    }
  )}

    }
  this.showinvoiceform=true
  this.showeditionnote=true
  this.showrecettejour=false
  let ammounts = this.editionnoteform.get('ammounts') as FormArray;
  ammounts.at(0).patchValue({
    numeronote:this.user.numeronote
   })
}
else if ((user.choixfacture=='saisie recette'))
{
  this.showinvoiceform=true
  this.showrecettejour=true
  this.showeditionnote=false
  for (let i = 1; i < 32; i++)
          {
            this.addammount2()
            let ammounts2 = this.recettejournaliereform.get('ammounts2') as FormArray;
            ammounts2.at(i).patchValue({
              jour:i
             })
             this.setdate2(i)
          }
          this.removeammount2(0)
          if(this.option2Value==='04'||this.option2Value==='06'||this.option2Value==='09'||this.option2Value==='11')
          {
            this.removeammount2(30)
          }
          if(this.option2Value=='02')
          {
            if(+this.option1Value % 4 ==0)
            {
            this.removeammount2(30)
            this.removeammount2(29)
            }
            else 
            {
            this.removeammount2(30)
            this.removeammount2(29)
            this.removeammount2(28)
            }

            
          }
}
  }
)

      
      

    } else {
      Swal.fire({
        title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs au chiffre d\'affaires, voulez vous continuer?',
        
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.value) {
          
          this.resetcaall();
          this.showcatab=false;
          this.option3Value=false;
          

        }
        else{
          checkbox.checked = true
          this.option3Value=true;

        }

      }).catch(() => {
        Swal.fire('opération non aboutie!');
      });
      
    }
  }
  myFunction2() {
    var checkbox:any = document.getElementById("myCheck2");
    var text2 = document.getElementById("tabcontainer");
    
    if (checkbox.checked == true){
      text2.style.display = "block";
      this.showachattab=true;
      this.option4Value=true;
      

    } else {
      Swal.fire({
        title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs aux achats, voulez vous continuer?',
        
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.value) {
          
          this.resetachatall();
          this.showachattab=false;
          this.option4Value=false;
          

        }
        else{
          checkbox.checked = true
          this.option4Value=true;

        }

      }).catch(() => {
        Swal.fire('opération non aboutie!');
      });
      
    }
  }
  myFunction3() {
    var checkbox:any = document.getElementById("myCheck3");
    var text2 = document.getElementById("tabcontainer");
    
    if (checkbox.checked == true){
      text2.style.display = "block";
      this.showbanquetab=true;
      this.option5Value=true;
      //verify user choice about method of declaring sales
this.usersservice.getUserById(this.currentUser.userId).then(
  async (user: User) => {
    this.loading = false;
    this.user = user;
     //veirifcation of user choice about releve method
     Swal.fire({
      title: 'Veuillez choisir le mode de saisie des relevés bancaire!',
      
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#555',
      confirmButtonText: 'Saisie manuelle',
      cancelButtonText: 'Annuler',
      denyButtonText: 'Téléchargement de document',
      
      }).then((result) => {
      if (result.isConfirmed) {
        this.showrelevemanuel=true
        this.showrelevejoint=false
        for (let i = 1; i < 32; i++)
          {
            this.addammount4()
            let ammounts4 = this.relevemanuelform.get('ammounts4') as FormArray;
            ammounts4.at(i).patchValue({
              jour:i
             })
             this.setdate4(i)
          }
          this.removeammount4(0)
          if(this.option2Value==='04'||this.option2Value==='06'||this.option2Value==='09'||this.option2Value==='11')
          {
            this.removeammount4(30)
          }
          if(this.option2Value=='02')
          {
            if(+this.option1Value % 4 ==0)
            {
            this.removeammount4(30)
            this.removeammount4(29)
            }
            else 
            {
            this.removeammount4(30)
            this.removeammount4(29)
            this.removeammount4(28)
            }

            
          }
      }
      else if (result.isDenied)
      {
        this.showrelevejoint=true
        this.showrelevemanuel=false
      }
      
      }).catch(() => {
      Swal.fire('opération non aboutie!');
      }); 
    })
    } else {
      Swal.fire({
        title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs aux banques, voulez vous continuer?',
        
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.value) {
          
          this.resetbanqueall();
          this.showbanquetab=false;
          this.option5Value=false;
          

        }
        else{
          checkbox.checked = true
          this.option5Value=true;

        }

      }).catch(() => {
        Swal.fire('opération non aboutie!');
      });
      
    }
  }
  myFunction4() {
    var checkbox:any = document.getElementById("myCheck4");
    var text2 = document.getElementById("tabcontainer");
    
    if (checkbox.checked == true){
      text2.style.display = "block";
      this.showsalairetab=true;
      this.option6Value=true;
    //verify user choice about method of declaring salary
this.usersservice.getUserById(this.currentUser.userId).then(
  async (user: User) => {
    this.loading = false;
    this.user = user;
     //veirifcation of user choice about salary method
     Swal.fire({
      title: 'Veuillez choisir le mode de saisie des fiches de paie!',
      
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#555',
      confirmButtonText: 'Saisie manuelle',
      cancelButtonText: 'Annuler',
      denyButtonText: 'Redirection vers le module paie',
      
      }).then((result) => {
      if (result.isConfirmed) {
        this.showpaiemanuel=true
      
      }
      else if (result.isDenied)
      {
        this.showpaiemanuel=false
        this.router.navigate(['declare-paie'])
      }
      
      }).catch(() => {
      Swal.fire('opération non aboutie!');
      }); 
    })  

    } else {
      Swal.fire({
        title: 'Vous êtes sur le point de réinitialiser tous les donnés relatifs aux salaires, voulez vous continuer?',
        
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Réinitialiser',
        cancelButtonText: 'Annuler',
      }).then((result) => {
        if (result.value) 
        {
          
          this.resetsalaireall();
          this.showsalairetab=false;
          this.option6Value=false;
        }
        else
        {
          checkbox.checked = true
          this.option6Value=true;
        }
      }).catch(() => {
        Swal.fire('opération non aboutie!');
      });
      
    }
  }
  update(e)
  {}
  onImagePick(event: Event,i:number) {
    let fileName = (event.target as HTMLInputElement).files[0].name;
    this.factureachatform.get('ammounts3').value.controls[i].patchValue({ image: fileName });  
  }
  onImagePick2(event: Event,i:number) {
    const file = (event.target as HTMLInputElement).files[0];
    this.relevejointform.get('ammounts5').value.at(i).image.patchValue(file);
    this.relevejointform.get('ammounts5').value.at(i).image.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.relevejointform.get('ammounts5').value.at(i).image.valid) {
        this.fileUploaded = true;
      } else {
      }
    };
    reader.readAsDataURL(file);
    
  }
  onImagePick3(event: Event,i:number) {
    const file = (event.target as HTMLInputElement).files[0];
    this.salaireform.get('ammounts6').value.at(i).image.patchValue(file);
    this.salaireform.get('ammounts6').value.at(i).image.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      if (this.salaireform.get('ammounts6').value.at(i).image.valid) {
        this.fileUploaded = true;
      } else {
      }
    };
    reader.readAsDataURL(file);
    
  }
  ngOnDestroy(){
    this.destroyed$.next();
   this.destroyed$.complete();
  }
  reloadPage (){
    setTimeout(() => window.location.reload(), 1000);
    
    
  }
}
