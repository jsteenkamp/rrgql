// map paths to modules here - paths are relative to baseUrl
function appRequireConfig(baseHref) {
  var basePath = baseHref ? baseHref : '';
  require.config({
    baseUrl: basePath + '/vendor',
    paths: {
      config: basePath + '/app/config',
      mappers: basePath + '/app/mappers',
      formatters: basePath + '/app/formatters',
      filters: basePath + '/app/filters',
      icons: basePath + '/app/icons',
      utils: basePath + '/app/utils',
    },
  });

  // use requirejs to load modules
  require([
    'config/config',
    'mappers/grid',
    'mappers/table',
    'formatters/format',
    'filters/filters',
    'icons/icons'
  ], function(config, grid, table, format, filters, icons) {
    // start app after modules loaded
    window.rrgql.render({
      config: config,
      mappers: {
        grid: grid,
        table: table,
      },
      formatters: format,
      filters: filters,
      icons: icons,
    });
  });
}
