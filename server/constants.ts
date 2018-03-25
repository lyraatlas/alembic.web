export const CONST = {
    ep: {
        API: '/api',
        V1: '/v1',
        AUTHENTICATE: '/authenticate',
        LOCAL: '/local',
        FACEBOOK: '/facebook',
        CB: '/cb',
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
        INLINE_PASSWORD_CHANGE: '/update-password-inline',
        LIKES: '/likes',
        COMMENTS: '/comments',
        client: {
        },
        common:{
            QUERY: '/query'
        }
    },
    TOKEN_HEADER_KEY: "x-access-token",
    ADMIN_ROLE: 'admin',
    GUEST_ROLE: 'guest',
    USER_ROLE: 'user',
    MOMENT_DATE_FORMAT: 'YYYY-MM-DD h:mm:ss a Z',
    ALEMBIC_API_Q_BACKPLANE: 'alembic-api-q-backplane',
    REQUEST_TOKEN_LOCATION: 'api-decoded-token',
    SALT_ROUNDS: 10,
    errorCodes: {
        EMAIL_TAKEN: 'EmailAlreadyTaken',
        PASSWORD_FAILED_CHECKS: 'PasswordFailedChecks',
        EMAIL_VERIFICATION_EXPIRED: 'EmailVerificationHasExpired',
        PASSWORD_RESET_TOKEN_EXPIRED: 'PasswordResetTokenExpired',
    },
    testing:{
        USER_EMAIL: "integration.user.role@alembic.com",
        GUEST_EMAIl: "integration.guest.role@alembic.com",
        ORGANIZATION_NAME: "IntegrationTestOrganization",
        PUSH_TOKEN: 'fLJEsDMKn1M:APA91bE3Ins30n5DksYkZ7AS7m0x6oH9sSFUbP01Jrb7UyELrjo8obESU_IwJ9qHuxLYA5zxLqjszJwyw4MLojJUEUgEo7DROixo-NyXFtYPgkq_pgy-P1v5nkYiQYkn5SobZU7HPMCj',
    },
    IMAGE_UPLOAD_PATH: './img-uploads/',
}