define(['formatters/format', 'utils/utils', 'lodash'], function(
  format,
  utils,
  lodash
) {
  // example of how to initialize reusable utils
  //var myUtils = utils(render);

  return {
    grid: {
      item: {
        id: function(params) {
          return params.item.id;
        },
        kind: function(params) {
          return 'alerts';
        },
        type: function(params) {
          return params.item.type;
        },
        name: function(params) {
          return params.item.id;
        },
        timestamp: function(params) {
          return params.item.id;
        },
      },
      // cells are always displayed
      cells: {
        c0: {
          data: function(params) {
            return format.color(params.item.score);
          },
          search: false,
        },
        c1: {
          tooltip: function(params) {
            return 'Item ID = ' + params.item.id;
          },
          data: function(params) {
            return params.item.icon;
          },
          search: false,
        },
        c2: {
          data: function(params) {
            return params.item.icon;
          },
          search: false,
        },
        c3: {
          data: function(params) {
            return params.item.icon;
          },
          search: false,
        },
        c4: {
          label: 'Score',
          data: function(params) {
            return params.item.score;
          },
          sort: 'numeric',
          order: 1,
          direction: 'desc',
        },
        c5: {
          label: 'Text1',
          data: function(params) {
            return params.item.text1;
          },
          sort: 'alpha',
          order: 2,
          direction: 'asc',
        },
        c6: {
          label: 'Text2',
          data: function(params) {
            return params.item.text2;
          },
          sort: 'alpha',
        },
        c7: {
          label: 'Text3',
          data: function(params) {
            return params.item.id;
          },
          sort: 'alpha',
        },
        c8: {
          label: 'Total1',
          data: function(params) {
            return 'Alerts: ' + params.item.total1;
          },
          sort: function(params) {
            return +params.item.total1;
          },
        },
        c9: {
          label: 'Total2',
          data: function(params) {
            return 'Types: ' + params.item.total2;
          },
          sort: function(params) {
            return +params.item.total2;
          },
        },
      },
      contextMenu: {
        handler: function(params) {
          console.log('Context Menu select', params.item, params.selection);
          /*
          switch (params.item.id) {
            case 'alertCard:takeView':
              return params.render({
                elem: 'view',
                data: params,
              });

            default:
            //
          }
          */
        },
        items: [
          {
            id: 'alertCard:takeView',
            name: 'Show Context',
            params: {
              view: {
                name: 'Alert',
                type: 'plugin',
                plugin: 'plugins/test',
              },
            },
          },
          {
            id: 'alertCard:takeJSON',
            name: 'Take Alert to Raw View',
            params: {
              view: {
                name: 'Alert (JSON)',
                type: 'json',
              },
            },
          },
        ],
      },
      previewPanel: {
        config: {
          direction: 'vertical',
          size: '50%'
        },
        handler: function(params) {
          // decide what happens when a tab is clicked
          switch (params.tab.id) {
            case 2:
              return params.render({
                elem: params.elem,
                type: 'plugin',
                src: 'plugins/test',
                data: params,
              });

            case 3:
              var items = [
                {id: 0, name: 'One', col0: 'Column 0', score: 5},
                {id: 1, name: 'Two', col1: 'Column 1', score: 3},
                {id: 2, name: 'Three', col2: 'Column 2', score: 9},
                {
                  id: 3,
                  name: 'Four',
                  col3: {title: 'Column 3', item: {id: 1, value: 'one'}},
                  col4: params.item
                },
              ];
              return params.render({
                elem: params.elem,
                type: 'table',
                items: items,
                mapper: params.mappers.table.table,
              });

            default:
              //
          }
        },
        tabs: [
          {id: 0, name: 'Viz 0'},
          {id: 1, name: 'Viz 1'},
          {id: 2, name: 'Viz 2 (PlugIn)'},
          {id: 3, name: 'Viz 3 (Component)'},
        ],
      },
    },
    entities: {
      item: {
        id: function(params) {
          return params.item.id;
        },
        kind: function(params) {
          return params.item.id;
        },
        type: function(params) {
          return params.item.id;
        },
        name: function(params) {
          return params.item.id;
        },
        timestamp: function(params) {
          return params.item.id;
        },
      },
      cells: {},
      contextMenu: {},
      previewPanel: {},
    },
    alerts: {},
    detections: {},
    events: {},
  };
});
