## Inspiration

The inspiration for Mimic came from the need to easily transfer design elements from websites into Canva. We noticed that many designers and marketers spend a lot of time recreating specific web elements and layouts in their design projects. Mimic aims to streamline this process, making it timely and efficient.

## What it does

Mimic effortlessly converts website elements into customizable Canva elements. Users can transform any part of a website into design elements that can be used in their Canva projects, enabling limitless creativity and saving valuable time.

## Features

1. **Web Scraping**: Extract components and styling properties from web pages.
2. **Canva Integration**: Convert web elements into Canva elements using the Canva Apps SDK.
3. **Real-time Processing**: Instantly generate Canva elements from web elements.
4. **Customization**: Modify the extracted elements to suit your design needs.

## How we built it

We used a combination of web scraping with Playwright to extract visible text and styling properties from web pages. These elements are then converted into a format compatible with Canva using the Canva Apps SDK.

## Challenges we ran into

One of the major challenges was accurately mapping web elements to Canva elements, ensuring that the visual integrity and functionality are maintained. Web styling doesn't transfer one-to-one to Canva styling, so we had to find specific ratios and conversions to make the elements look as intended.

## Accomplishments that we're proud of

We are proud of successfully integrating web scraping with Playwright and converting those elements into Canva in a way that maintains the original design's aesthetics. Additionally, the smooth user experience and real-time processing capabilities are significant achievements.

## What we learned

1. Canva Apps SDK
2. Playwright for Web Scraping
3. PX format conversions
4. Cross-browser compatibility issues and solutions

## What's next for Mimic

Next, we plan to enhance Mimic's capabilities by adding support for more complex web elements, such as interactive components and animations. We also aim to improve the user interface and provide more customization options for the extracted elements. Furthermore, we are exploring ways to integrate Mimic with other design tools to broaden its usability.

## Run Locally
