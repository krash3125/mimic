import {
  Button,
  FormField,
  MultilineInput,
  Rows,
  Text,
  TextInput,
  Title,
} from '@canva/app-ui-kit';
import { addNativeElement, getCurrentPageContext } from '@canva/design';
import { auth } from '@canva/user';
import React, { useState } from 'react';
import styles from 'styles/components.css';
import { addBox, delay } from 'utils/elements';

// const BACKEND_URL = `${BACKEND_HOST}`;
const BACKEND_URL = `http://localhost:5000`;

type State = 'idle' | 'loading' | 'success' | 'error';

export const App = () => {
  const [input, setInput] = useState('https://purduepool.com');
  const [state, setState] = useState<State>('idle');
  const [responseBody, setResponseBody] = useState<unknown | undefined>(
    undefined
  );

  const sendRequest2 = async () => {
    try {
      setState('loading');
      const page = await getCurrentPageContext();

      if (!page.dimensions) {
        setState('error');
        return;
      }

      const { height, width } = page.dimensions;
      const res = await fetch(`${BACKEND_URL}/api/v1/scrape/text`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          height,
          width,
          url: input,
        }),
      });

      const body = await res.json();
      setResponseBody(body);

      for (const div of body) {
        let top, left, width;
        if (div?.textAlign === 'center' || div?.fontSize > 18 || true) {
          const factor = 0.112;
          const extra = div?.width * factor;
          const y_shift = (div?.height - div?.fontSize) / 2.6;
          top = div?.y + y_shift;
          // top = div?.y;
          left = div?.x - extra / 2;
          width = div?.width * (1 + factor);
        } else {
          top = div?.y;
          left = div?.x;
          width = div?.width;
        }

        if (['start', 'center', 'end', 'justify'].includes(div?.textAlign)) {
          addNativeElement({
            type: 'TEXT',
            children: [div?.text],
            width: width,
            top: top,
            left: left,
            color: div?.fontColor,
            fontSize: div?.fontSize,
            fontWeight: div?.fontWeight,
            textAlign: div?.textAlign,
            // fontStyle: div?.fontStyle,
            // decoration: div?.textDecoration,
            // fontFamily: div?.fontFamily,
          });
        }
      }

      setState('success');
    } catch (error) {
      setState('error');
      console.error(error);
    }
  };

  const sendRequest = async () => {
    try {
      setState('loading');
      const page = await getCurrentPageContext();

      if (!page.dimensions) {
        setState('error');
        return;
      }

      const { height, width } = page.dimensions;
      const res = await fetch(`${BACKEND_URL}/api/v1/scrape/divs`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          height,
          width,
          url: input,
        }),
      });

      const body = await res.json();
      setResponseBody(body);

      for (const div of body) {
        addBox({
          bg: div?.bg,
          height: div?.height,
          left: div?.x,
          top: div?.y,
          width: div?.width,
          borderRadiusTopLeft: parseInt(
            div?.borderTopLeftRadius?.replace('px', '')
          ),
          borderRadiusTopRight: parseInt(
            div?.borderTopRightRadius?.replace('px', '')
          ),
          borderRadiusBottomLeft: parseInt(
            div?.borderBottomLeftRadius?.replace('px', '')
          ),
          borderRadiusBottomRight: parseInt(
            div?.borderBottomRightRadius?.replace('px', '')
          ),
        });
      }

      setState('success');
    } catch (error) {
      setState('error');
      console.error(error);
    }
  };

  return (
    <div className={styles.scrollContainer}>
      <Rows spacing="3u">
        <TextInput
          placeholder="Enter webpage url"
          value={input}
          onChange={(e) => setInput(e)}
        />
        <Text>
          This example demonstrates how apps can securely communicate with their
          servers via the browser's Fetch API.
        </Text>

        {/* Idle and loading state */}
        {state !== 'error' && (
          <>
            <Button
              variant="primary"
              onClick={sendRequest}
              loading={state === 'loading'}
              stretch
            >
              Get Boxes
            </Button>
            {state === 'success' && responseBody && (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={5} autoGrow readOnly />
                )}
              />
            )}
          </>
        )}

        {/* Idle and loading state */}
        {state !== 'error' && (
          <>
            <Button
              variant="primary"
              onClick={sendRequest2}
              loading={state === 'loading'}
              stretch
            >
              Get Texts
            </Button>
            {state === 'success' && responseBody && (
              <FormField
                label="Response"
                value={JSON.stringify(responseBody, null, 2)}
                control={(props) => (
                  <MultilineInput {...props} maxRows={5} autoGrow readOnly />
                )}
              />
            )}
          </>
        )}

        {/* Error state */}
        {state === 'error' && (
          <Rows spacing="3u">
            <Rows spacing="1u">
              <Title size="small">Something went wrong</Title>
              <Text>To see the error, check the JavaScript Console.</Text>
            </Rows>
            <Button
              variant="secondary"
              onClick={() => {
                setState('idle');
              }}
              stretch
            >
              Reset
            </Button>
          </Rows>
        )}
      </Rows>
    </div>
  );
};
