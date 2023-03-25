'use strict';

/**
 * plot service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::plot.plot');
