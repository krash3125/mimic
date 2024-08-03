import {
  Rows,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@canva/app-ui-kit';

import React, { useState } from 'react';
import styles from 'styles/components.css';
import Explore from './explore';
import Generate from './generate';

export const App = () => {
  const [input, setInput] = useState('https://purduepool.com');
  const [active, setActive] = useState('generate');

  return (
    <div className={styles.scrollContainer}>
      <Tabs activeId={active}>
        <Rows spacing="1u">
          <TabList>
            <Tab onClick={() => setActive('generate')} id="generate">
              Generate
            </Tab>
            <Tab onClick={() => setActive('explore')} id="explore">
              Explore
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel id="generate">
              <Generate input={input} setInput={setInput} />
            </TabPanel>
            <TabPanel id="explore">
              <Explore setInput={setInput} setActive={setActive} />
            </TabPanel>
          </TabPanels>
        </Rows>
      </Tabs>
    </div>
  );
};
