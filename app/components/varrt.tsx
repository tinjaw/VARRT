import { remote } from 'electron';
import { promises } from 'fs';
import jsonata from 'jsonata';
import sha1 from 'sha1';

const xslx = require('json-as-xlsx');

// eslint-disable-next-line import/prefer-default-export
export async function readJSONFile() {
  const filename = await remote.dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return promises.readFile(filename.filePaths[0]).then((value) => {
    return JSON.parse(value.toString());
  });
}

export const exportAsCSV = async (gameAsJSON) => {
  const expression = jsonata(
    '`Game Map`.*.{"Symbol Code": "SFGPU------****",' +
      ' "Name": BasicName, "Comment": "This is a comment.",' +
      ' "Latitude": function($pixels) { 57.64451092 - $pixels * 0.000245657 }(CurrentX),' +
      ' "Longitude": function($pixels) { 22.9375029 + $pixels * 0.000388979 }(CurrentX)}'
  );
  const result = expression.evaluate(gameAsJSON);
  // noinspection SpellCheckingInspection
  const columns = [
    { label: 'Symbol Code', value: () => 'SFGPU------****' },
    { label: 'Name', value: (row) => row.Name },
    { label: 'Comment', value: () => 'This is a fine comment.' },
    { label: 'Latitude', value: (row) => row.Latitude },
    { label: 'Longitude', value: (row) => row.Longitude },
    { label: 'Key', value: (row) => sha1(row.Name) },
  ];
  const settings = {
    sheetName: 'First Sheet',
    fileName: 'COP View',
    extraLength: 3,
  };
  const download = true;
  xslx(columns, result, settings, download);
};
