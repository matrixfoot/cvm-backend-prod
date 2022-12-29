import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Carousel } from '../models/settings';
import { CarouselService } from '../services/settings';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  carousels: Carousel[];
  carouselsSub: any;
  sortedcarousels: Carousel[];

  constructor(
    private carousel:CarouselService,private router: Router
  ) { }

  ngOnInit() {
    this.carouselsSub = this.carousel.carousels$.subscribe(
      (carousels) => {
        this.carousels = carousels; 
        this.sortedcarousels=this.carousels.sort((a, b) => a.rang - b.rang);
    
      },
      (error) => {
        
      }
    );
    
      this.carousel.getCarouselalldata();
  }
  getNavigation(link, id){
      
    this.carousel.getCarouseldataById(id);
    this.router.navigate([link + '/' + id]); 
  }
}
