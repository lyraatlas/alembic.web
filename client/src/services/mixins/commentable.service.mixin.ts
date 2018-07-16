import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONST } from '../../constants';
import { IBaseModel, ICommentable } from '../../models';
import { BaseService } from '../base/base.service';

export class CommentableServiceMixin{

    public service:BaseService<IBaseModel>;

    addComment(item: ICommentable, comment: string): Observable<ICommentable>{
        return this.service.http
        .post(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.COMMENTS}/${item._id}`, {comment: comment}, this.service.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.service.handleError);
     }

     editComment(item: ICommentable, commentId: string, updatedComment: string){
        return this.service.http
        .post(`${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.COMMENTS}/${item._id}`, {
            comment: updatedComment,
            _id: commentId,
        }, this.service.requestOptions)
        .map((res: Response) => {
            return res.json();
        }).catch(this.service.handleError);
     }

     removeComment(item: ICommentable, commentId: string): Observable<ICommentable>{
        // we need to add a body to this guy.
        this.service.requestOptions.body = {
            body:{
                    _id: commentId
            }
        }

        return this.service.http
        .delete(
            `${this.service.serviceConfig.rootApiUrl}/${this.service.serviceConfig.urlSuffix}${CONST.ep.COMMENTS}/${item._id}`,
            this.service.requestOptions
        )
        .map((res: Response) => {
            // after this is done, but before we return I think I want to null out the request options... I don't want to have those remain past a request.
            // This might be a tricky bug to find if it doesn't quite work right. 
            this.service.requestOptions.body = null;
            return res.json(); 
        }).catch(this.service.handleError);
     }
}