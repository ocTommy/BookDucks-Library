'use strict';

/**
 * startpage service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::startpage.startpage');
