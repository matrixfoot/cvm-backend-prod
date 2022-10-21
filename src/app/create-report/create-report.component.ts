import { Component } from '@angular/core';  
  
import pdfMake from "pdfmake/build/pdfmake";  
import pdfFonts from "pdfmake/build/vfs_fonts";  
pdfMake.vfs = pdfFonts.pdfMake.vfs;  


@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: [ './create-report.component.scss',
 
],

})

export class CreateReportComponent{
  generatePDF() {  
    let docDefinition = {  
      header: 'C#Corner PDF Header',  
      content: 'Sample PDF generated with Angular and PDFMake for C#Corner Blog'  
    };  
   
    pdfMake.createPdf(docDefinition).open();  
  }  

}
