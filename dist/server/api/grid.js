import express from 'express';
import uuid from 'uuid';
import _delay from 'lodash/fp/delay';
import _random from 'lodash/random';

// import faker from 'faker';
// console.log(faker.fake("{{internet.avatar}}, {{internet.email}} {{internet.ip}}"));

const router = express.Router(); // eslint-disable-line new-cap

// random int min, max inclusive
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// random real min inclusive, max exclusive, decimals
const getRandomReal = (min, max, dp) => {
  return (Math.random() * (max - min) + min).toFixed(dp);
};


// context menus
const contextMenus = {
  item: [
    {id: '1', name: 'Context Menu 1', spacer: true},
    {
      id: '2', name: 'Item Context Menu 2', spacer: false, options: [
      {id: '1', name: 'Option Status 1', spacer: true},
      {id: '2', name: 'Option Status 2'},
      {id: '3', name: 'Option Status 3', spacer: true},
      {id: '4', name: 'Option Status 4'},
    ]
    },
    {
      id: '3', name: 'Item Context Menu 3', spacer: false, options: [
      {id: '1', name: 'Option Status 1', spacer: true},
      {id: '2', name: 'Option Status 2'},
      {id: '3', name: 'Option Status 3', spacer: true},
      {id: '4', name: 'Option Status 4'},
      {id: '5', name: 'Option Status 5'},
      {id: '6', name: 'Option Status 6'},
      {id: '7', name: 'Option Status 7'},
      {id: '8', name: 'Option Status 8'},
      {id: '9', name: 'Option Status 9'},
      {id: '10', name: 'Option Status 10', spacer: true},
      {id: '11', name: 'Option Status 11 (with a very long name to check wrapping)'},
    ]
    }
  ]
};

// filters must have options
const filters = [
  {
    id: 'type', name: 'Type', options: [
    {id: 'periodicity', name: 'Periodicity'},
    {id: 'traffic', name: 'Traffic'},
    {id: 'interaction', name: 'Interaction'}
  ]
  },
  {
    id: 'high-value-alerts', name: 'High Value Alerts', options: [
    {id: 'default', name: ''}
  ]
  },
  {
    id: 'sort-by', name: 'Sort By', options: [
    {id: 'avg-score', name: 'Avg Score'},
    {id: 'max-score', name: 'Max Score'}
  ]
  },
  {
    id: 123, name: 'Numbers', options: [
    {id: 1, name: 'one'},
    {id: 2, name: 'two'},
    {id: 3, name: 'three'},
  ]
  }
];


const alertTypes = [
  {id: 0, type: 'behaviour', icon: '/assets/icons/black/apple.png'},
  {id: 1, type: 'domain login', icon: '/assets/icons/black/bubble.png'},
  {id: 2, type: 'host interaction', icon: '/assets/icons/black/camera.png'},
  {id: 3, type: 'periodicity', icon: '/assets/icons/black/enter.png'},
  {id: 4, type: 'remote login', icon: '/assets/icons/black/lock.png'},
  {id: 5, type: 'traffic', icon: '/assets/icons/black/alarm.png'},
  {id: 6, type: 'user interaction', icon: '/assets/icons/black/user.png'}
];

const entityNames = ['IP Address', 'Username', 'Domain Name', 'MAC Address'];

// item spec
const templates = {
  item: {
    options: {
      truncate: true,
      showPreview: true,
      showProperties: true,
      selectable: true
    },
    columns: [
      {id: 'color', type: 'color', formatter: 'color'},
      {id: 'icon', type: 'icon'},
      {id: 'score', label: 'Score', sort: 'numeric', formatter: 'score'},
      {id: 'id', label: 'ID', sort: 'alpha'},
      {id: 'type', label: 'Type', sort: 'alpha', formatter: 'type'},
      {id: 'text1', label: 'Text 1', sort: 'alpha'},
      {id: 'text2', label: 'Text 2', sort: 'numeric', formatter: 'timestamp', align: 'left'},
      {id: 'text3', label: 'Text 3', sort: 'alpha'},
      {id: 'total1', label: 'Alerts', sort: 'numeric'},
      {id: 'total2', label: 'Types', sort: 'numeric'},
    ],
    tsProp: 'text2'
  }
};


const generateItem = () => {
  const alert = alertTypes[getRandomInt(0, 6)];
  const status = getRandomInt(0, 16);
  return {
    id: uuid.v4(),
    type: alert.type,
    icon: alert.icon,
    score: getRandomReal(1, 15, 2),
    status,
    text1: entityNames[getRandomInt(0, 3)],
    text2: new Date().getTime() + getRandomInt(0, 100000),
    text3: status,
    total1: getRandomInt(10, 9999),
    total2: getRandomInt(3, 15)
  };
};

const generateItems = (n) => {
  let items = [];
  for (let i = 0; i < n; i++) {
    items.push(generateItem());
  }
  // sort on score (desc)
  items.sort((a, b) => {
    return b.score - a.score;
  });
  return items;
};

const generateData = (g, c) => {
  let groups = [];
  for (let i = 0; i < g; i++) {
    groups.push({
      id: uuid.v4(),
      name: `Group ${i + 1}`,
      items: generateItems(c),
      templates,
      filters
    });
  }
  return groups;
};


const generateEntities = (c) => {
  return {
    id: uuid.v4(),
    name: 'Entities',
    //type: 'grid',
    items: generateItems(c),
    templates,
    filters,
    contextMenus,
    loadingMessages: {
      preview: 'Getting alerts for entity...',
      summary: 'Building summary view...'
    }
  };
};


// routes

// groups of items (legacy)
router.get('/data/:groups/:items', (req, res) => {
  const {groups, items} = req.params;
  res.json({data: generateData(groups, items)});
});

// entities (items)
router.get('/entities/:items', (req, res) => {
  const {items} = req.params;
  res.json({data: generateEntities(items)});
});

// entities (items)
router.get('/items/:numItems', (req, res) => {
  const {numItems} = req.params;
  //_delay(_random(2000, 10000), () => res.json({data: generateItems(numItems)}));
  res.json({data: generateItems(numItems)});
});


export default router;