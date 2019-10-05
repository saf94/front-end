/* eslint-disable max-len */
import React, { useState } from 'react';
import TimelineEvent from './TimelineEvent/TimelineEvent';
import historyData from './historyData';
import styles from './Timeline.css';

function filterDataByYear(year, setfilteredHistoryData) {
  const filteredHistoryData = Object.keys(historyData).filter(dataYear => dataYear === year);
  setfilteredHistoryData({ [year]: historyData[filteredHistoryData] });
}

function Timeline() {
  const [filteredHistoryData, setfilteredHistoryData] = useState(historyData);

  return (
    <div className={styles.timeline}>
      <div className={styles.filters}>
        {Object.keys(historyData).map(year => (
          <button
            type="button"
            key="year"
            className={styles.filterItem}
            onClick={() => filterDataByYear(year, setfilteredHistoryData)}
          >
            {year}
          </button>
        ))}
      </div>
      {Object.keys(filteredHistoryData).map(year => (
        <div className={styles.segment} key={year}>
          <div className={styles.date}>
            <h3>{year}</h3>
          </div>

          <div className={styles.vertLine}>
            <div className={styles.line} />
            <div className={styles.bubble} />
          </div>

          <div className={styles.timelineEvent}>
            {filteredHistoryData[year].map(({ title, content }) => (
              <TimelineEvent key={`${year} - ${title}`} title={title} content={content} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Timeline;
