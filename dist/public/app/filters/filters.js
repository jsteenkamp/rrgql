define(['lodash'], function(lodash) {
  return {
    alerts: {
      all:[
        {
          id: 'scoregt5',
          name: 'Score > 5',
          options: [
            {
              id: 'default',
              name: '',
              filter: function(item) {
                return +item.score > 5;
              },
            }
          ],
        },
        {
          id: 'scorelt5',
          name: 'Score < 5',
          options: [
            {
              id: 'default',
              name: '',
              filter: function(item) {
                return +item.score < 5;
              },
            }
          ],
        },
      ],
      'periodicity': [
        {
          id: 'scorebetween',
          name: 'Score (periodicity)',
          filter: function(item) {
            return 4 <= +item.score && +item.score <= 10;
          },
          options: [
            {
              id: 'default',
              name: '',
              filter: function(item) {
                return 4 <= +item.score && +item.score <= 10;
              },
            }
          ],
        },
        {
          id: 'alerttypes',
          name: 'Alert Types',
          filter: function(item) {
            return +item.score > 5;
          },
          options: [
            {
              id: 'behaviour',
              name: 'Behaviour',
              filter: function(item) {
                return +item.score >= 12;
              },
            },
            {
              id: 'domainlogin',
              name: 'Domain Login',
              filter: function(item) {
                return 10 <= +item.score && +item.score < 12;
              },
            },
            {
              id: 'interaction',
              name: 'Interaction',
              filter: function(item) {
                return +item.score >= 8 && +item.score < 10;
              },
            },
            {
              id: 'periodicitydns',
              name: 'Periodicity DNS',
              filter: function(item) {
                return +item.score >= 6 && +item.score < 8;
              },
            },
            {
              id: 'periodicityproxy',
              name: 'Periodicity Proxy',
              filter: function(item) {
                return +item.score >= 4 && +item.score < 6;
              },
            },
            {
              id: 'remotelogin',
              name: 'Remote Login',
              filter: function(item) {
                return +item.score >= 2 && +item.score < 4;
              },
            },
            {
              id: 'traffic',
              name: 'Traffic',
              filter: function(item) {
                return +item.score >= 0 && +item.score < 2;
              },
            }
          ]
        },

      ],
      'host-interaction': [
        {
          id: 'scorebetween',
          name: 'Score (host interaction)',
          filter: function(item) {
            return +item.score >= 2 && +item.score <= 2;
          },
          options: [
            {
              id: 'default',
              name: '',
              filter: function(item) {
                return +item.score >= 2 && +item.score <= 6;
              },
            }
          ],
        },
      ],
      'domain-login': [
        {
          id: 'scorebetween',
          name: 'Score (domain login)',
          filter: function(item) {
            return +item.score >= 2 && +item.score <= 2;
          },
          options: [
            {
              id: 'default',
              name: '',
              filter: function(item) {
                return +item.score >= 2 && +item.score <= 6;
              },
            }
          ],
        },
      ],
    },
    detections: {},
    entities: {},
    events: {}
  };
});