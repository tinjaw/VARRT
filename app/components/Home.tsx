import React from 'react';
import styles from './Home.css';

export default function Home(): JSX.Element {
  return (
    <div className={styles.container} data-tid="container">
      <button type="button" className="btn btn-primary">
        Easy Button
      </button>
    </div>
  );
}
