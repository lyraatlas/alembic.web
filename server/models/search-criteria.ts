import { NextFunction, Request } from 'express';
import { IBaseSearchCriteria } from './base/base-search-criteria.interface';

export class SearchOptions {
    public limit: number;
    public skip: number;
    public searchCriteria: IBaseSearchCriteria | string;
    public sort: string;

    constructor(request: Request, next: NextFunction) {
        this.limit = parseInt(request.query.limit, 10) || 25;
		this.skip = parseInt(request.query.skip, 10) || 0;
		// Either pull the search params out of the body, or off the query string.
        this.searchCriteria = request.body.searchParams || request.query.searchParams || null;

		// Here we're converting what is actually a string on the body, or query string, into
		// our base search Params object.
        try {
            if (this.searchCriteria) {
                this.searchCriteria = JSON.parse(this.searchCriteria as string) as IBaseSearchCriteria;
            }
        } catch (err) {
            next(err);
        }

        this.sort = request.query.sort || request.query.sortBy || request.query.sortby || null;

        try {
            if (this.sort) {
                this.sort = JSON.parse(this.sort);
            }
        } catch (err) {
            next(err);
        }
	}
}
