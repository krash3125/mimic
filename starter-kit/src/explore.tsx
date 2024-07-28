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

const Explore = () => {
  return (
    <Box width="full" paddingTop="2u">
      <Rows spacing="2u">
        <ExampleSiteCard title="Purdue Pool" url="https://purduepool.com" />
        <ExampleSiteCard title="Amazon" url="https://www.amazon.com" />
        <ExampleSiteCard title="Google" url="https://www.google.com" />
        <ExampleSiteCard title="Facebook" url="https://www.facebook.com" />
        <ExampleSiteCard title="Twitter" url="https://www.twitter.com" />
      </Rows>
    </Box>
  );
};

export default Explore;

const ExampleSiteCard = ({ title, url }: { title: string; url: string }) => {
  return (
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
            height="full"
          >
            <Text variant="bold" size="medium">
              {title}
            </Text>
            <Text size="small">{url}</Text>
          </Box>
        </Column>
      </Columns>
    </Box>
  );
};
