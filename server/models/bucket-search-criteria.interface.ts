import { IBaseSearchCriteria } from "./base/base-search-criteria.interface";

export interface IBucketSearchCriteria extends IBaseSearchCriteria{
	includeImages: boolean,
	includeComments: boolean,
}
