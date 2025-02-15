// inject libs
var libs = [
  'lib/chartist.min.js',
  'lib/dom-to-image.min.js'
];
libs.forEach(function (path) {
  var lib = document.createElement('script');
  lib.src = browser.extension.getURL(path);
  (document.head || document.documentElement).appendChild(lib);
  lib.parentNode.removeChild(lib);
});

// add image url object
var uipp_images = {
  stay: browser.extension.getURL('img/mission-stay.jpg'),
  ship: browser.extension.getURL('img/mission-ship.jpg'),
  metal: browser.extension.getURL('img/mine-metal.png'),
  crystal: browser.extension.getURL('img/mine-crystal.png'),
  deuterium: browser.extension.getURL('img/mine-deuterium.png'),
  astrophysics: browser.extension.getURL('img/tech-astro.png'),
  plasma: browser.extension.getURL('img/tech-plasma.png'),
  features: {
    alliance: browser.extension.getURL('img/features/alliance.png'),
    charts: browser.extension.getURL('img/features/charts.png'),
    deploytransport: browser.extension.getURL('img/features/deploytransport.png'),
    galaxy: browser.extension.getURL('img/features/galaxy.png'),
    minetext: browser.extension.getURL('img/features/minetext.png'),
    missingresources: browser.extension.getURL('img/features/missingresources.png'),
    nextbuilds: browser.extension.getURL('img/features/nextbuilds.png'),
    solarsat: browser.extension.getURL('img/features/solarsat.png'),
    ship: browser.extension.getURL('img/features/ship.png'),
    stats: browser.extension.getURL('img/features/stats.png'),
    storagetime: browser.extension.getURL('img/features/storagetime.png'),
    topeco: browser.extension.getURL('img/features/topeco.png'),
    topfleet: browser.extension.getURL('img/features/topfleet.png'),
    topgeneral: browser.extension.getURL('img/features/topgeneral.png'),
    topresearch: browser.extension.getURL('img/features/topresearch.png')
  },
  resources: {
    metal: browser.extension.getURL('img/resources/metal.png'),
    crystal: browser.extension.getURL('img/resources/crystal.png'),
    deuterium: browser.extension.getURL('img/resources/deuterium.png')
  }
};
var imgScript = document.createElement('script');
imgScript.innerHTML = 'var uipp_images = ' + JSON.stringify(uipp_images) + ';';
(document.head || document.documentElement).appendChild(imgScript);
imgScript.parentNode.removeChild(imgScript);

// inject main script
var userscript = function () {
  'use strict';

  // window.config default values
  window.config = window._getConfig();
  window._setConfigTradeRate();
  window._setConfigMyPlanets();
  window._parseResearchTab();

  window.config.features = window.config.features || {};
  var defaultFeatures = {
    alliance: true,
    charts: true,
    deploytransport: true,
    galaxy: true,
    minetext: true,
    missingresources: true,
    nextbuilds: true,
    ship: true,
    solarsat: true,
    stats: true,
    storagetime: true,
    topeco: true,
    topfleet: true,
    topgeneral: true,
    topresearch: true
  };
  for (var featureKey in defaultFeatures) {
    if (typeof window.config.features[featureKey] !== 'boolean') {
      window.config.features[featureKey] = defaultFeatures[featureKey];
    }
  }

  var features = window.config.features;

  // Add tabs in the left menu
  if (features.alliance) {
    window._addTabAlliance();
  }

  if (features.stats || features.charts || features.nextbuilds) {
    window._addTabStats();
  }

  if (features.topeco || features.topfleet || features.topgeneral || features.topresearch) {
    window._addTabTopflop();
  }

  window._addTabSettings();
  window._addLinkTabs();

  // Add static helpers
  window._addInprogParser();

  if (features.storagetime) {
    window._addCurrentPlanetStorageHelper();
  }

  if (features.deploytransport) {
    window._addPlanetFleetShortcuts();
  }

  // Add interval checkers
  if (features.galaxy) {
    window._addGalaxyPlayersPlanetsInterval();
  }

  if (features.minetext || features.missingresources) {
    window._addCostsHelperInterval();
  }

  if (features.ship) {
    window._addShipHelperInterval();
  }

  if (features.solarsat) {
    window._addSolarSatHelperInterval();
  }

  // Refresh universe data (config.players)
  window._refreshUniverseData();

  // Add historical point logger
  window._logHistoryData();

  // Tracking code
  window._setupAnalytics();
};

// inject user script into the document
var script = document.createElement('script');
script.textContent = '(' + userscript + ')()';
(document.head || document.documentElement).appendChild(script);
script.parentNode.removeChild(script);
