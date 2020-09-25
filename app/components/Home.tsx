import React from 'react';
import { remote } from 'electron';
import { promises } from 'fs';
import styles from './Home.css';

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

  function getOnClick() {
    async function getClick() {
      const foo = await getFile();
      // eslint-disable-next-line no-console
      console.log(`We finish with ${JSON.stringify(foo)}`);
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
