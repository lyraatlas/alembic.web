export class ServiceConfig {
    rootApiUrl: string;
    urlSuffix: string;

    constructor(config: ServiceConfigType) {
        this.rootApiUrl = config.rootApiUrl;
        this.urlSuffix = config.urlSuffix;
        return this;
    }
}

export interface ServiceConfigType {
    rootApiUrl: string;
    urlSuffix: string;
};