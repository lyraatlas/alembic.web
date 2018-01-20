'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['lyraatlas.alembic.web'],
  /**
   * Your New Relic license key.
   */
  license_key: '17c38944aacff277ad2ac2e1bef8971f8b4e0b6d',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
