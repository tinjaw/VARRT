import { remote } from 'electron';
import { promises } from 'fs';
import jsonata from 'jsonata';
import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';

const xslx = require('json-as-xlsx');
const { create } = require('xmlbuilder2');

// eslint-disable-next-line import/prefer-default-export
export async function readJSONFile() {
  const filename = await remote.dialog.showOpenDialog({
    properties: ['openFile'],
  });
  return promises.readFile(filename.filePaths[0]).then((value) => {
    return JSON.parse(value.toString());
  });
}

export async function exportAsCSV(gameAsJSON: any) {
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
    { label: 'Name', value: (row: any) => row.Name },
    { label: 'Comment', value: () => 'This is a fine comment.' },
    { label: 'Latitude', value: (row: any) => row.Latitude },
    { label: 'Longitude', value: (row: any) => row.Longitude },
    { label: 'Key', value: (row: any) => sha1(row.Name) },
  ];
  const settings = {
    sheetName: 'First Sheet',
    fileName: 'COP View',
    extraLength: 3,
  };
  const download = true;
  xslx(columns, result, settings, download);
}

export async function exportAsSPL(gameAsJSON: string) {
  const root = create({ version: '1.0', encoding: 'utf-8' }).ele('PlanLayer');
  root
    .att('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema')
    .att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
    .att(
      'xmlns',
      'http://schemas.systematic.com/2011/products/plan-layer-definition-v1'
    )
    .ele('CustomAttributes', {
      // eslint-disable-next-line prettier/prettier
      'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4'
    })
    .ele('CustomAttributeEntry')
    .ele('Key')
    .txt('customId')
    .up()
    .ele('Value')
    .txt(uuidv4())
    .up()
    .up()
    .up()
    .ele('Name', {
      // eslint-disable-next-line
      'xlsns':
        'http://schemas.systematic.com/2011/products/layer-definition-v4'
    })
    .txt('OPSUM 09OCT1500Z2025')
    .up()
    .ele(
      'SecurityClassification',
      // eslint-disable-next-line
      { 'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4' }
    )
    .txt('Unmarked')
    .up()
    .ele('Symbols', {
      // eslint-disable-next-line
      'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4'
    });

  root
    .ele('Id', {
      // eslint-disable-next-line
      'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4'
    })
    .ele('FirstLong')
    .up()
    .ele('SecondLong')
    .up()
    .up()
    .ele('Extension', {
      // eslint-disable-next-line
      'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4'
    })
    .ele('ExtensionDescription')
    .txt(
      'This extension contains prefix and suffix for the security' +
        ' classification for the plan layer'
    )
    .up()
    .ele('SecurityClassificationPrefix')
    .up()
    .ele('SecurityClassificationPostfix')
    .up()
    .up()
    .ele('DevelopmentState', {
      // eslint-disable-next-line
      'xmlns': 'http://schemas.systematic.com/2011/products/layer-definition-v4'
    })
    .txt('NotComplete');
  const xml = root.end({ prettyPrint: true });
  await promises.writeFile('LandPower.spl', xml);
}
