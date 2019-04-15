import { Component, Input, OnInit } from "@angular/core";
import { faComment, faHeart, faPen, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { ErrorEventBus } from "../../../../event-buses";
import { BucketEventBus } from "../../../../event-buses/bucket.event-bus";
import { IBucket } from "../../../../models";
import { BucketService } from "../../../../services";

@Component({
  selector: "app-bucket-card-buttons",
  templateUrl: "./bucket-card-buttons.component.html",
  styleUrls: ["./bucket-card-buttons.component.scss"]
})
export class BucketCardButtonsComponent implements OnInit {
  public faComment = faComment;
  public faHeart = faHeart;
  public faPencilAlt = faPencilAlt;
  public faPen = faPen;

  @Input() bucket: IBucket;
  @Input() isEditable: boolean = true;
  constructor(public bucketService: BucketService, public errorEventBus: ErrorEventBus, public bucketEventBus: BucketEventBus) {}

  ngOnInit() {}

  quickEdit(bucket: IBucket) {
    this.bucketEventBus.startEditBucket(this.bucket);
  }

  addRemoveLike(bucket: IBucket) {
    this.bucketService.liker.toggleLike(bucket, this.errorEventBus).subscribe(item => {
      bucket = item;
    });
  }
}
