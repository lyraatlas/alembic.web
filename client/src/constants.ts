export const CONST = {
    ep: {
        API: '/api',
        V1: '/v1',
        AUTHENTICATE: '/authenticate',
        USERS: '/users',
        REGISTER: '/register',
        API_DOCS: '/api-docs',
        API_SWAGGER_DEF: '/swagger-definition',
        PERMISSIONS: '/permissions',
        ROLES: '/roles',
        UPGRADE: '/upgrade',
        ORGANIZATIONS: '/organizations',
        PRODUCT_TEMPLATES: '/product-templates',
        PRODUCTS: '/products',
        SUPPLIERS: '/suppliers',
        ORDERS: '/orders',
        DELETE_IMAGE: '/delete-image',
        DELETE_IMAGE_GROUP: '/delete-image-group',
        CREATE_FROM_TEMPLATE: '/create-product-from-template',
        UPLOAD_IMAGES: '/upload-images',
        SEND: '/send',
        ACCEPT: '/accept',
        REJECT: '/reject',
        PICKUP: '/pickup',
        DELIVER: '/deliver',
        COMPLETE: '/complete',
        client: {
        },
        common:{
            QUERY: '/query'
        }
    },
    CLIENT_DECODED_TOKEN_LOCATION: 'decoded-token',
    CLIENT_TOKEN_LOCATION: 'token',
    MOMENT_DATE_FORMAT: 'YYYY-MM-DD h:mm:ss a Z',
    // These error codes are returned from the server to make it easier to programattically handle certain errrors.
    ErrorCodes: {
        EMAIL_TAKEN: 'EmailAlreadyTaken',
        PASSWORD_FAILED_CHECKS: 'PasswordFailedChecks',
        EMAIL_VERIFICATION_EXPIRED: 'EmailVerificationHasExpired',
        PASSWORD_RESET_TOKEN_EXPIRED: 'PasswordResetTokenExpired'
    }
}