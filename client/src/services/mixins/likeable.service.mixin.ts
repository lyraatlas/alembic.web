import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONST } from '../../constants';
import { ErrorEventBus } from '../../event-buses';
import { IBaseModel, ILikeable } from '../../models';
import { BaseService } from '../base/base.service';
import { UserService } from '../user.service';

export class LikeableServiceMixin {

  public service: BaseService<IBaseModel>;

  public addLike(item: ILikeable): Observable<ILikeable> {
    return this.service.http
      .patch(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, {}, this.service.requestOptions)
      .map((res: Response) => {
        return res.json();
      }).catch(this.service.handleError);
  }

  public removeLike(item: ILikeable): Observable<ILikeable> {
    return this.service.http
      .delete(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.LIKES}/${item._id}`, this.service.requestOptions)
      .map((res: Response) => {
        return res.json();
      }).catch(this.service.handleError);
  }


  public toggleLike(likeableItem: ILikeable, errorEventBus: ErrorEventBus):Observable<ILikeable> {
    if (likeableItem.likedBy.indexOf(UserService.getCurrentUserId()) > -1) {
      return this.removeLike(likeableItem).map(updatedItem => {
        updatedItem.isLikedByCurrentUser = false;
        return updatedItem;
      }, error => {
        errorEventBus.throw(error);
      });
    } else {
      return this.addLike(likeableItem).map(updatedItem => {
        updatedItem.isLikedByCurrentUser = true;
        return updatedItem;
      }, error => {
        errorEventBus.throw(error);
      });
    }
  }

  public static calculateLikeStatus(items: Array<ILikeable>) {

    const userId = UserService.getCurrentUserId();
    items.forEach(item => {
      // we're going to flag the bucket as to whether the current user has liked this bucket.
      item.likedBy.forEach(token => {
        if (token == userId) {
          item.isLikedByCurrentUser = true;
        }
      })
    });
  }
}
