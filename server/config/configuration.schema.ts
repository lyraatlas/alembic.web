import convict = require('convict');

export class ConfigurationSchema{
public static convictSchema: convict.Config = convict({
    env: {
      doc: 'The applicaton environment.',
      format: ['production', 'development', 'ci', 'test', 'staging', 'integration'],
      default: 'development',
      env: 'NODE_ENV'
    },
    port: {
      doc: 'The port to bind.',
      format: 'port',
      default: 9000,
      env: 'PORT'
    },
    name: {
      doc: 'The current app name could be useful for debugging',
      format: String,
      default: 'alembic.web',
      env: 'APP_NAME'
    },
    mongoConnectionString: {
      doc: 'Mongo Connection string',
      format: '*',
      default: '',
      env: 'MONGO_CONNECTION_STRING',
      sensitive: true,
    },
    jwtSecretToken: {
      doc: 'The secrect token were signing jwts with',
      format: String,
      default: '',
      env: 'JWT_SECRET_TOKEN',
      sensitive: true
    },
    instagramClientId: {
      doc: 'Instagram Client ID',
      format: String,
      default: '',
      env: 'INSTAGRAM_CLIENT_ID',
      sensitive: true
    },
    instagramClientSecret: {
      doc: 'Instagram Secret',
      format: String,
      default: '',
      env: 'INSTAGRAM_SECRET',
      sensitive: true
    },
    facebookClientId: {
      doc: 'Instagram Client ID',
      format: String,
      default: '',
      env: 'INSTAGRAM_CLIENT_ID',
      sensitive: true
    },
    facebookClientSecret: {
      doc: 'Instagram Secret',
      format: String,
      default: '',
      env: 'FACEBOOK_CLIENT_SECRET',
      sensitive: true
    },
    APILocation: {
      doc: 'API Location',
      format: String,
      default: 'http://localhost:9000',
      env: 'API_LOCATION',
      sensitive: false
    },
    returnCallStackOnError: {
      doc: 'When the api encounters an error do we return a call stack',
      format: Boolean,
      default: true,
      env: 'RETURN_CALL_STACK',
    },
    isConsoleLoggingActive: {
      doc: 'Do we want to log output to the console?',
      format: Boolean,
      default: true,
      env: 'CONSOLE_LOGGING',
    },
    isConsoleColored: {
      doc: 'Colorization Affects the logging, so be careful on which environments you turn this on.',
      format: Boolean,
      default: true,
      env: 'CONSOLE_COLOR',
    },
    mandrillApiKey:{
      doc:'DEFAULT HERE IS TEST KEY! This is the api key that we want to use with mandrill.  Keep in mind there is a different test for the integration environment',
      format: String,
      default: '',
      env: 'MANDRILL_API_KEY',
      sensitive: true
    },
    AWSAccessKey:{
      doc:'Access Key for S3',
      format: String,
      default: '',
      env: 'AWS_ACCESS_KEY',
      sensitive: true
    },
    AWSSecret:{
      doc:'Access Secret for S3',
      format: String,
      default: '',
      env: 'AWS_S3_SECRET',
      sensitive: true
    },
    AlembicS3Bucket:{
      doc:'Bucket where were uploading product images',
      format: String,
      default: 'dev-alembic-app-images',
      env: 'ALEMBIC_S3_BUCKET_NAME',
      sensitive: true
    },
    AlembicS3BucketRootUrl:{
      doc:'This is the root of the url that well use whenever a product image is added.',
      format: String,
      default: 'https://s3.amazonaws.com/',
      env: 'ALEMBIC_S3_BUCKET_ROOT_URL',
      sensitive: true
    },
    clientDistFolder:{
      doc:'The client dist folder needs to be set, we build the docker image with all the client folders built.',
      format: String,
      default: 'dist',
      env: 'CLIENT_DIST_FOLDER',
      sensitive: false,
    }
  });
}