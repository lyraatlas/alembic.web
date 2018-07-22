export class RestUrlBuilder {
    protected rootApiUrl: string = null;
    protected urlSuffix: string = null;
    protected urlSuffixPlural: string = null;
    protected usePlural: boolean = false;
    protected id: string = null;
    protected operation: string = null;
    protected query: Object = null;
    protected skip: number = null;
    protected limit: number = null;

    constructor() {
        return this;
    }

    setRootApiUrl(rootApiUrl: string) {
        this.rootApiUrl = rootApiUrl;
        return this;
    }

    setUrlSuffix(urlSuffix: string) {
        this.urlSuffix = urlSuffix;
        return this;
    }

    setUrlSuffixPlural(urlSuffixPlural: string) {
        this.urlSuffixPlural = urlSuffixPlural;
        return this;
    }

    withConfig(configuration?: RestUrlConfigType): RestUrlBuilder {
        if (configuration === undefined) {
            this.id = null;
            this.operation = null;
            return this;
        }

        if (configuration.rootApiUrl !== undefined) {
            this.rootApiUrl = configuration.rootApiUrl;
        }

        if (configuration.urlSuffix !== undefined) {
            this.urlSuffix = configuration.urlSuffix;
        }

        if (configuration.urlSuffixPlural !== undefined) {
            this.urlSuffixPlural = configuration.urlSuffixPlural;
        }

        if (configuration.usePlural !== undefined) {
            this.usePlural = configuration.usePlural;
        }

        if (configuration.id !== undefined) {
            this.id = configuration.id;
        } else {
            this.id = null;
        }

        if (configuration.operation !== undefined) {
            this.operation = configuration.operation;
        } else {
            this.operation = null;
        }

        if (configuration.query !== undefined) {
            this.query = configuration.query;
        } else {
            this.query = null;
        }

        if (configuration.skip !== undefined) {
            this.skip = configuration.skip;
        } else {
            this.skip = null;
        }

        if (configuration.limit !== undefined) {
            this.limit = configuration.limit;
        } else {
            this.limit = null;
        }

        return this;
    }

    build() {
        const urlParts: Array<string> = [];
        urlParts.push(this.rootApiUrl);
        if (this.rootApiUrl.lastIndexOf('/') !== this.rootApiUrl.length - 1) {
             //urlParts.push('/');
        }

        if (this.usePlural) {
            urlParts.push(this.urlSuffixPlural);
        } else {
            urlParts.push(this.urlSuffix);
        }

        if (this.id !== null) {
            urlParts.push('/');
            urlParts.push(this.id);
        }

        if (this.operation !== null) {
            urlParts.push(this.operation);
        }

        if (this.query !== null) {
            urlParts.push('?');
            urlParts.push(this.toQueryString(this.query));
            if(this.skip !== null && this.limit !== null){
                urlParts.push(`&skip=${this.skip}&limit=${this.limit}`)
            }
        }else{
            if(this.skip !== null && this.limit !== null){
                urlParts.push(`?skip=${this.skip}&limit=${this.limit}`)
            }
        }

        return urlParts.join('');
    }

    /**
     * Encode a base js object as {a:2, d:[1,"two"], c: {foo: {bar:1}}}
     * And returns URL encoded string : a=2&d[0]=1&d[1]=two&c[foo][bar]=1"
     *
     * @param  {Object} object A base javascript object : {}
     * @param  {String} base   Optionnal base notation, should only be used by recursion for internal work
     * @return {String}        URL encoded query string
     */
    private toQueryString(object: Object, base?: string): string {
        const queryString: String[] = [];

        Object.keys(object).forEach((key)=> {
            let result: String;
            const value: any = object[key];

            if (base !== undefined) {
                key = base + '[' + key + ']';
            }

            switch (typeof value) {
                case 'object':
                    if ( Object.prototype.toString.call( value ) === '[object Array]' ) {
                        const qs = {};
                        value.forEach((val, i) => {
                            qs[i] = val;
                        });
                        result = this.toQueryString(qs, key);
                    } else {
                        result = this.toQueryString(value, key);
                    }
                    break;
                default:
                    result = key + '=' + encodeURIComponent(value);
            }

            if (value !== null) {
                queryString.push(result);
            }
        });

        return queryString.join('&');
    };
}

export interface RestUrlConfigType {
    rootApiUrl?: string;
    urlSuffix?: string;
    urlSuffixPlural?: string;
    urlPrefix?: string;
    usePlural?: boolean;
    id?: string;
    operation?: string;
    query?: Object;
    skip?: number;
    limit?: number;
};