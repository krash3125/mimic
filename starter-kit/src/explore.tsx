import React from 'react';
import {
  Box,
  Column,
  Columns,
  EyeIcon,
  Rows,
  Text,
  Title,
} from '@canva/app-ui-kit';
import styles from 'styles/components.css';

const Explore = ({
  setInput,
  setActive,
}: {
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Box width="full" paddingTop="2u">
      <Rows spacing="2u">
        <ExampleSiteCard
          title="Amazon"
          url="https://www.amazon.com"
          setInput={setInput}
          setActive={setActive}
        />
        <ExampleSiteCard
          title="Purdue Pool"
          url="https://purduepool.com"
          setInput={setInput}
          setActive={setActive}
        />
        <ExampleSiteCard
          title="Shadcn"
          url="https://ui.shadcn.com"
          setInput={setInput}
          setActive={setActive}
        />
        <ExampleSiteCard
          title="Spotify"
          url="https://open.spotify.com/"
          setInput={setInput}
          setActive={setActive}
        />
        <ExampleSiteCard
          title="Twitter"
          url="https://www.twitter.com"
          setInput={setInput}
          setActive={setActive}
        />
      </Rows>
    </Box>
  );
};

export default Explore;

const ExampleSiteCard = ({
  title,
  url,
  setInput,
  setActive,
}: {
  title: string;
  url: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  setActive: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div
      className={styles.cursorPointer}
      onClick={() => {
        setInput(url);
        setActive('generate');
      }}
    >
      <Box>
        <Columns spacing="2u">
          <Column width="content">
            <Box
              className={styles.boxSizeSm}
              display="flex"
              alignItems="center"
              justifyContent="center"
              background="neutralLow"
              borderRadius="standard"
            >
              <EyeIcon />
            </Box>
          </Column>
          <Column>
            <Box
              className={styles.heightSm}
              flexDirection="column"
              justifyContent="center"
              display="flex"
            >
              <Text variant="bold" size="medium">
                {title}
              </Text>
              <Text size="small">{url}</Text>
            </Box>
          </Column>
        </Columns>
      </Box>
    </div>
  );
};
