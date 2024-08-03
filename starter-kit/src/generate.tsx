import {
  Box,
  Button,
  FormField,
  MultilineInput,
  Rows,
  Switch,
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
import { fetchBoxes, fetchTexts, scrapeAll } from 'utils/fetch';
import { generalizeURL } from 'utils/url';

type State = 'idle' | 'loading' | 'success' | 'error';

const Generate = ({
  input,
  setInput,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [state, setState] = useState<State>('idle');
  const [includeDivs, setIncludeDivs] = useState(true);
  const [includeTexts, setIncludeTexts] = useState(true);

  const generate = async () => {
    try {
      setState('loading');
      const generalizedUrl = generalizeURL(input);
      setInput(generalizedUrl);

      const page = await getCurrentPageContext();

      let include = {
        boxes: includeDivs,
        texts: includeTexts,
      };

      const elements = await scrapeAll(generalizedUrl, page, include);

      console.log(elements.length);
      await delayAddElements(elements);

      setState('success');
    } catch (error) {
      setState('error');
      console.error(error);
    }
  };

  return (
    <Box width="full" paddingTop="2u">
      <Rows spacing="4u">
        <Rows spacing="1.5u">
          <Text variant="bold">Website URL</Text>
          <TextInput
            placeholder="Enter webpage url"
            value={input}
            onChange={(e) => setInput(e)}
            disabled={state === 'loading'}
          />
        </Rows>

        <Rows spacing="1.5u">
          <Text variant="bold">Options</Text>
          <Box paddingStart="0.5u">
            <Switch
              label="Include Divs"
              value={includeDivs}
              onChange={setIncludeDivs}
              disabled={state === 'loading'}
            />
          </Box>

          <Box paddingStart="0.5u">
            <Switch
              label="Include Texts"
              defaultValue={true}
              value={includeTexts}
              onChange={setIncludeTexts}
              disabled={state === 'loading'}
            />
          </Box>
        </Rows>

        <Box paddingTop="1.5u">
          <Button
            variant="primary"
            onClick={generate}
            loading={state === 'loading'}
            stretch
          >
            Generate
          </Button>
        </Box>
      </Rows>
      <Box paddingTop="3u">
        <Text alignment="center" tone="tertiary" size="small">
          Load times may vary due to canva's rate limit restrictions.
        </Text>
      </Box>
    </Box>
  );
};

export default Generate;
