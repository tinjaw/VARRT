import React from 'react';
import styles from './Home.css';
import { exportAsCSV, exportAsSLF, exportAsSPL, readJSONFile } from './varrt';

function getOnClick() {
  async function getClick() {
    const gameAsJSON = await readJSONFile();
    // eslint-disable-next-line no-console
    console.log(gameAsJSON);
    await exportAsCSV(gameAsJSON);
    await exportAsSLF(gameAsJSON);
    await exportAsSPL(gameAsJSON);
  }
  return getClick;
}

export default function Home(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <button type="button" className="btn btn-primary" onClick={getOnClick()}>
        Easy Button
      </button>
    </div>
  );
}
