import { Component, OnInit } from '@angular/core';
import { BucketService } from '../../../services/bucket.service';
import { IBucket } from '../../../models';

@Component({
  selector: 'app-bucket-list',
  templateUrl: './bucket-list.component.html',
  styleUrls: ['./bucket-list.component.scss']
})
export class BucketListComponent implements OnInit {

  constructor(public bucketService: BucketService) { }

  ngOnInit() {
    this.bucketService.getMyList().subscribe((items: Array<IBucket>) =>{
        
        console.dir(items);
    })
  }

}
