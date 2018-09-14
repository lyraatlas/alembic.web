import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { BucketEventType } from '../enumerations';
import { IBucket } from '../models';
import { AlertService } from '../services';

export interface IBucketEventMessage{
    bucket: IBucket,
    eventType: BucketEventType,
}

@Injectable()
export class BucketEventBus {
    private BucketChangedSource = new Subject<IBucketEventMessage>();
	public BucketChanged$ = this.BucketChangedSource.asObservable();
	
			
	public originalName: string;
	public originalDesc: string;

	constructor(private alertService: AlertService){};
	
	public startCreateBucket(bucket:IBucket){
		this.emitMessage(bucket,BucketEventType.startCreate)
	}

	public createBucket(bucket:IBucket){
		this.emitMessage(bucket,BucketEventType.created);
	}

	public cancelBucketCreate(bucket:IBucket){
		this.emitMessage(bucket,BucketEventType.cancelCreate);
	}

	public startEditBucket(bucket:IBucket){
		this.originalName = bucket.name;
		this.originalDesc = bucket.description;
		this.emitMessage(bucket,BucketEventType.startEdit);
	}

	public saveEditBucket(bucket:IBucket){
		this.originalName = null;
		this.originalDesc = null;
		this.emitMessage(bucket,BucketEventType.edited);
	}

	public cancelEditBucket(bucket:IBucket){
		bucket.name = this.originalName;
		bucket.description = this.originalDesc;
		this.emitMessage(bucket,BucketEventType.cancelEdit);
	}

	public removeBucket(bucket:IBucket){
		this.emitMessage(bucket,BucketEventType.removed);
	}

    private emitMessage(bucket: IBucket, eventType: BucketEventType){
        this.BucketChangedSource.next({
            eventType: eventType,
            bucket: bucket,
        })
    }
}