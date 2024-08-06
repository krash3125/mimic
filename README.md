## Inspiration

The inspiration for Mimic came from the need to easily transfer design elements from websites into Canva. We noticed that many designers and marketers spend a lot of time recreating specific web elements and layouts in their design projects. Mimic aims to streamline this process, making it quick and efficient.

## What it does

Mimic effortlessly converts website elements into customizable Canva elements. Users can transform any part of a website into design elements that can be used in their Canva projects, enabling limitless creativity and saving valuable time.

## How we built it

We used a combination of web scraping with Playwright to extract visible text and styling properties from web pages. These elements are then converted into a format compatible with Canva using the Canva Apps SDK.

## Challenges we ran into

One of the major challenges was accurately mapping web elements to Canva elements, ensuring that the visual integrity and functionality are maintained. Web styling doesn't transfer one-to-one to Canva styling, so we had to find specific ratios and conversions to make the elements look as intended.

## Accomplishments that we're proud of

We are proud of successfully integrating web scraping with Playwright and converting those elements into Canva in a way that maintains the original design's aesthetics. Additionally, the smooth user experience and real-time processing capabilities are significant achievements.

## What we learned

1. Canva Apps SDK
2. Playwright for Web Scraping
3. Server Sent Events
4. XYZ
5. XYZ

## What's next for Mimic

Next, we plan to enhance Mimic's capabilities by adding support for more complex web elements, such as interactive components and animations. We also aim to improve the user interface and provide more customization options for the extracted elements. Furthermore, we are exploring ways to integrate Mimic with other design tools to broaden its usability.

## Run Locally
