import moment from 'moment';
import CSV from 'comma-separated-values';
import fileSaver from 'file-saver';
import {cellValue} from './mapper';

export default ({columns, items}) => {
  const header = [];

  // get keys of first item, loop through and join them into string to get column headers
  columns.map(col => {
    const {column, show, label} = col;
    if (column !== 'c0' && column !== 'c1' && show) {
      header.push(label);
    }
  });

  // add rows (filtered by headers = show)
  const rows = items.map(item => {
    const row = {};
    columns.map(col => {
      const {column, show, data} = col;
      if (column !== 'c0' && column !== 'c1' && show) {
        row[column] = cellValue({data, item});
      }
    });
    return row;
  });
  const csv = new CSV(rows, {header}).encode();
  const ts = moment().format('YYYY.MM.DD-HH.mm.ss');
  const blob = new Blob([csv], {type: 'text/csv; charset=utf8;'});
  fileSaver.saveAs(blob, `data-${ts}.csv`);
};
