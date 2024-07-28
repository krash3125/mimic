import {
  Rows,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@canva/app-ui-kit';

import React from 'react';
import styles from 'styles/components.css';
import Explore from './explore';
import Generate from './generate';

export const App = () => {
  return (
    <div className={styles.scrollContainer}>
      <Tabs>
        <Rows spacing="1u">
          <TabList>
            <Tab id="generate">Generate</Tab>
            <Tab id="explore">Explore</Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="generate">
              <Generate />
            </TabPanel>
            <TabPanel id="explore">
              <Explore />
            </TabPanel>
          </TabPanels>
        </Rows>
      </Tabs>
    </div>
  );
};
