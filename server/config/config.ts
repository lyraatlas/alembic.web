import convict = require('convict');
import { ConfigurationSchema } from './configuration.schema';

export class Config{
  public static active = ConfigurationSchema.convictSchema;
  public static initialize(){
    // Load environment dependent configuration 
    var env = ConfigurationSchema.convictSchema.get('env');
    ConfigurationSchema.convictSchema.loadFile([
        './server/environments/all-environments.json',
        './server/environments/all-environments.secrets.json',
        './server/environments/' + env + '.json',  // Load the regular convict settings.
        './server/environments/' + env + '.secrets.json' // by seperating out our secrets, it's easier to determine what values we need to set by env variables.
    ]);
    
    // Perform validation 
    ConfigurationSchema.convictSchema.validate({allowed: 'strict'});
  }
}

Config.initialize();