import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { MimeType } from '../../enumerations';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch'

import { ServiceError } from '../../classes/app-error.class'
import { IBaseModel } from '../../models';
import { environment } from "../../environments/environment";
import { ServiceConfigType, ServiceConfig } from './service-config';
import { RestUrlConfigType, RestUrlBuilder } from '../../builders/rest-url.builder';
import { CONST } from '../../constants';


export class BaseService<T extends IBaseModel> {

    protected restUrlBuilder: RestUrlBuilder = new RestUrlBuilder();
    protected requestOptions: RequestOptions;
    protected serviceConfig: ServiceConfigType;

    // tslint:disable-next-line:member-ordering
    public static convertToClass<T>(obj: Object, classToInstantiate): T {
        for (const i in obj) {
            if (obj.hasOwnProperty(i)) {
                classToInstantiate[i] = obj[i];
            }
        }
        return classToInstantiate;
    }

    constructor(
        protected http: Http,
        serviceConfigType: ServiceConfigType
    ) {
        this.serviceConfig = new ServiceConfig(serviceConfigType);
        this.requestOptions = new RequestOptions({
            headers: new Headers({ 
                'Content-Type': MimeType.JSON,
                'x-access-token': localStorage.getItem(CONST.CLIENT_TOKEN_LOCATION)
         }),
        });

        this.restUrlBuilder.withConfig({
            rootApiUrl: this.serviceConfig.rootApiUrl,
            urlSuffix: this.serviceConfig.urlSuffix
        });

        return this;
    }

    get<T extends IBaseModel>(id: string): Observable<T> {
        const url = this.buildUrl({ id });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getList<T extends IBaseModel>(query?: Object, skip?: number, limit?:number): Observable<T[]> {
        const url = this.buildUrl({ query, skip:skip, limit:limit });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    query<T extends IBaseModel>(query: Object, skip?: number, limit?:number): Observable<T[]> {
        const url = this.buildUrl({operation: 'query', skip:skip, limit:limit });
        return this.http
            .post(url,query, this.requestOptions)
            .map((res: Response) => {
                // TODO: Clean this up to return the correct model object an observable of query response which will have paging in it.
                return res.json()['results'];
            })
            .catch(this.handleError);
    }

    delete<T extends IBaseModel>(id: string, query?: Object): Observable<void> {
        const url = this.buildUrl({ id, query });
        return this.http
            .delete(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    create<T extends IBaseModel>(T: T, query?: Object): Observable<T> {
        const url = this.buildUrl({ query });
        return this.http
            .post(url, T, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    update<T extends IBaseModel>(T: T, id: string, query?: Object): Observable<T> {
        const url = this.buildUrl({ id: id, query: query });
        console.log(url);
        return this.http
            .patch(url, T, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // This is used for single operations that execute, and return a single object.
    // item.checkout is a good example of this kind of operation.
    // We will clear chache when this method gets executed
    executeSingleOperation<T extends IBaseModel>(id: string, operation?: string, query?: Object): Observable<T> {
        const url: string = this.buildUrl({ id, operation, query });
        return this.http
            .get(url, this.requestOptions)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // This is used for listing operations that return a list of objects.
    // item.versions is a good example, where you're going to return a list of items.
    executeListOperation<T extends IBaseModel>(id: string, operation: string, query?: Object): Observable<T[]> {
        const url = this.buildUrl({ id, operation, query });
        return this.http.get(url, this.requestOptions).map((res: Response) => {
            return res.json();
        }).catch(this.handleError);
    }

    protected buildUrl(configuration?: RestUrlConfigType): string {
        return this.restUrlBuilder.withConfig(configuration).build();
    }

    // The server will be sending this back:
    // response.json({
    //     message: error.message || 'Server Error',
    //     status: error.status || 500,
    //     URL: request.url,
    //     method: request.method,
    //     stack: Config.active.get('returnCallStackOnError') ? error.stack : '',
    //     requestBody: request.body
    // });
    protected handleError(errorResponse: Response | any) {
        // TODO: Implement Real Logging infrastructure.
        // Might want to log to remote server (Fire and forget style)
        const appError = new ServiceError();
        if (errorResponse instanceof Response) {
            const body = errorResponse.json() || '';
            appError.message = body.message ? body.message : 'no message provided';
            appError.description = body.description ? body.description : 'no description provided';
            appError.stack = body.stack ? body.stack : 'no stack provided';
            appError.statusCode = errorResponse.status;
            appError.statusText = errorResponse.statusText;
            return Observable.throw(appError);
        } else {
            appError.message = typeof errorResponse.message !== 'undefined' ? errorResponse.message : errorResponse.toString();
            return Observable.throw(appError);
        }
    }
}

