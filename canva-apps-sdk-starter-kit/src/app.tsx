import { Button, Rows, Text, TextInput } from '@canva/app-ui-kit';
import { addNativeElement } from '@canva/design';
import * as React from 'react';
import { useState } from 'react';
import styles from 'styles/components.css';

export const App = () => {
  const [input, setInput] = useState('');

  const onClick = async () => {
    addNativeElement({
      type: 'TEXT',
      children: [input],
    });
    addNativeElement({
      type: 'SHAPE',
      paths: [
        {
          d: 'M 0 0 H 100 V 100 H 0 L 0 0',
          fill: {
            color: '#ff0099',
          },
        },
      ],
      viewBox: {
        height: 100,
        width: 100,
        left: 0,
        top: 0,
      },
    });
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="2u">
        <TextInput
          placeholder="Enter webpage url"
          value={input}
          onChange={(e) => setInput(e)}
        />
        <Text>
          To make changes to this app, edit the <code>src/app.tsx</code> file,
          then close and reopen the app in the editor to preview the changes.
        </Text>
        <Button variant="primary" onClick={onClick} stretch>
          Do something cool
        </Button>
      </Rows>
    </div>
  );
};
