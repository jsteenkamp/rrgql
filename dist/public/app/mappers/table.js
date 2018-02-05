define(['formatters/format'], function(format) {
  return {
    table: {
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
      // include keys will be displayed, empty array [] = all non-excluded keys will be displayed
      include: [],
      // excluded data keys will not be displayed
      exclude: ['icon'],
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
          label: 'Id',
          data: function(params) {
            return params.item.id;
          },
          sort: 'alpha',
        },
        c3: {
          label: 'Score',
          data: function(params) {
            return params.item.score;
          },
          sort: 'numeric',
          direction: 'desc',
          order: 2,
        },
        c4: {
          label: 'Status',
          data: function(params) {
            return params.item.status;
          },
          sort: 'numeric',
        },
        c5: {
          label: 'Type',
          data: function(params) {
            return params.item.type;
          },
          sort: 'alpha',
          direction: 'desc',
        },
        c6: {
          label: 'Text 1',
          data: function(params) {
            return params.item.text1;
          },
          sort: 'alpha',
          direction: 'asc',
          order: 1,
        },
        c7: {
          label: 'Text 2',
          data: function(params) {
            return params.item.text2;
          },
          sort: 'alpha',
          align: 'right',
        },
        c8: {
          label: 'Text 3',
          data: function(params) {
            return params.item.status === 8 ? params.item : params.item.text3;
          },
          sort: 'alpha',
        },
      },
      columnNameHeader: {
        c0: {
          cellRange: ['c2', 'c4'],
          data: function() {
            return 'Default with a very very long title';
          },
        },
        c1: {
          cellRange: ['c6', 'c7'],
          data: function() {
            return 'Context with a very very long title';
          },
        },
      },
      contextMenu: {
        handler: function(params) {
          console.info('Mapper select', params.item, params.selection);
        },
        items: [
          {
            id: 'alertCard:takeView',
            name: 'Show Context',
            params: {
              view: {
                name: 'Alert',
                type: 'plugin',
                plugin: '/app/plugins/Chart/index.html',
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
                {id: 0, name: 'One', col0: 'Column 0'},
                {id: 1, name: 'Two', col1: 'Column 1'},
                {id: 2, name: 'Three', col2: 'Column 2'},
                {id: 3, name: 'Four', col3: {id: 1, name: 'One'}},
              ];
              return params.render({elem: params.elem, type: 'table', items: items});

            default:
            // no renderer
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
    entities: {},
    alerts: {},
    detections: {},
    events: {},
  };
});
