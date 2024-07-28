import {
  Box,
  Button,
  FormField,
  MultilineInput,
  Rows,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@canva/app-ui-kit';
import { addNativeElement, getCurrentPageContext } from '@canva/design';
import { auth } from '@canva/user';
import React, { useState } from 'react';
import styles from 'styles/components.css';
import { addBox, delay, delayAddElements, Element } from 'utils/elements';
import { findFonts } from '@canva/asset';
import Explore from './explore';
import { fetchBoxes, fetchTexts } from 'utils/fetch';

type State = 'idle' | 'loading' | 'success' | 'error';

const Generate = () => {
  const [input, setInput] = useState('https://purduepool.com');
  const [state, setState] = useState<State>('idle');

  const addTexts = async () => {
    try {
      setState('loading');
      const page = await getCurrentPageContext();

      const texts = await fetchTexts(input, page);
      await delayAddElements(texts);

      setState('success');
    } catch (error) {
      setState('error');
      console.error(error);
    }
  };

  const addBoxes = async () => {
    try {
      setState('loading');
      const page = await getCurrentPageContext();

      const boxes = await fetchBoxes(input, page);
      await delayAddElements(boxes);

      setState('success');
    } catch (error) {
      setState('error');
      console.error(error);
    }
  };

  return (
    <Box width="full" paddingTop="2u">
      <Rows spacing="3u">
        <TextInput
          placeholder="Enter webpage url"
          value={input}
          onChange={(e) => setInput(e)}
        />

        <Button
          variant="primary"
          onClick={addBoxes}
          loading={state === 'loading'}
          stretch
        >
          Get Boxes
        </Button>
        <Button
          variant="primary"
          onClick={addTexts}
          loading={state === 'loading'}
          stretch
        >
          Get Texts
        </Button>
      </Rows>
    </Box>
  );
};

export default Generate;
