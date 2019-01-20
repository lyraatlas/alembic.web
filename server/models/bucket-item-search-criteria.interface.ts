import { IBaseSearchCriteria } from "./base/base-search-criteria.interface";

export interface IBucketItemSearchCriteria extends IBaseSearchCriteria{
	includeImages: boolean,
	includeComments: boolean,
}
