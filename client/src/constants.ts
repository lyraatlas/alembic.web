export const CONST = {
    ep: {
        API: '/api',
        V1: '/v1',
        AUTHENTICATE: '/authenticate',
        LOCAL: '/local',
        FACEBOOK: '/facebook',
        TWITTER: '/twitter',
        GOOGLE: '/google',
        INSTAGRAM: '/instagram',
        USERS: '/users',
        ROLES: '/roles',
        BUCKETS: '/buckets',
        BUCKET_ITEMS:'/bucket-items',
        REGISTER: '/register',
        API_DOCS: '/api-docs',
        API_SWAGGER_DEF: '/swagger-definition',
        NOTIFICATIONS: '/notifications',
        UPLOAD_IMAGES: '/upload-images',
        LOGIN: '/login',
        CALLBACK: '/callback',
        EMAIL_VERIFICATIONS: '/email-verifications',
        PASSWORD_RESET: '/password-reset',
        PASSWORD_RESET_TOKENS: '/password-reset-tokens',
        VALIDATE_EMAIL: '/validate-email',
        PASSWORD_RESET_REQUEST: '/password-reset-request',
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