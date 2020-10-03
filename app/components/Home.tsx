import React from 'react';
import { remote } from 'electron';
import { promises } from 'fs';
import jsonata from 'jsonata';
import styles from './Home.css';

const parse = require('json2csv');
const xslx = require('json-as-xlsx');

export default function Home(): JSX.Element {
  async function getFile() {
    const filename = await remote.dialog.showOpenDialog({
      properties: ['openFile'],
    });
    return promises.readFile(filename.filePaths[0]).then((value) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return JSON.parse(value);
    });
  }

  async function queryFileForJSON() {
    const rawData = await getFile();
    const jsonData = JSON.stringify(rawData);
    // eslint-disable-next-line no-console
    console.log(`We finish with ${jsonData}`);
    const expression = jsonata(
      '`Game Map`.*.{"Symbol Code": "SFGPU------****", "Name": BasicName, "Comment": "This is a comment.", "Latitude": function($pixels) { 57.64451092 - $pixels * 0.000245657 }(CurrentX), "Longitude": function($pixels) { 22.9375029 + $pixels * 0.000388979 }(CurrentX)}'
    );
    const result = expression.evaluate(rawData);
    // noinspection JSUnusedLocalSymbols
    const columns = [
      { label: 'Symbol Code', value: (row) => 'SFGPU------****' },
      { label: 'Name', value: (row) => row.Name },
      { label: 'Comment', value: (row) => 'This is a fine comment.' },
      { label: 'Latitude', value: (row) => row.Latitude },
      { label: 'Longitude', value: (row) => row.Longitude },
    ];
    const settings = {
      sheetName: 'First Sheet',
      fileName: 'COP View',
      extraLength: 3,
    };
    const download = true;
    xslx(columns, result, settings, download);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(result));
    return result;
  }

  function getOnClick() {
    async function getClick() {
      const result = await queryFileForJSON();
      // Convert JSON to CSV
      const csv = parse(result);
      // eslint-disable-next-line no-console
      console.log(csv);
    }
    return getClick;
  }

  return (
    <div className={styles.container} data-tid="container">
      <button
        className="f3 link dim br2 ph3 pv2 mb2 dib white bg-dark-red"
        onClick={getOnClick()}
        data-tclass="btn"
        type="button"
      >
        <i className="far fa-play-circle" />
        &nbsp;Easy Button
      </button>
    </div>
  );
}
