import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IImage } from '../../../models/image.interface';
		
@Component({
  selector: 'app-thumb-grid',
  templateUrl: './thumb-grid.component.html',
  styleUrls: ['./thumb-grid.component.scss']
})
export class ThumbGridComponent implements OnInit {

  @Input() public imageList: Array<IImage> = [];

  constructor(private route: ActivatedRoute,
	private router: Router,) { }

  ngOnInit() {
  }

}
