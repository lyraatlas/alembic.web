import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONST } from '../../constants';
import { IBaseModel, ILikeable } from '../../models';
import { BaseService } from '../base/base.service';

export class LikeableServiceMixin{

    public service:BaseService<IBaseModel>;

    public addLike(item: ILikeable): Observable<ILikeable>{
        return this.service.http
        .patch(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, {}, this.service.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.service.handleError);
     }

     removeLike(item: ILikeable): Observable<ILikeable>{
        return this.service.http
        .delete(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, this.service.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.service.handleError);
     }
}