// const UNSUPPORTED_URLS = ['x.com', 'twitter.com', 'reddit.com'];
const UNSUPPORTED_URLS = ['reddit.com'];

export const checkIfSuported = (url: string) => {
  url = url.toLowerCase();

  for (const link of UNSUPPORTED_URLS) {
    if (url.includes(link)) {
      return false;
    }
  }
  return true;
};

export const generalizeURL = (url: string) => {
  url = url.replace(/(^\w+:|^)\/\//, '');
  url = url.replace(/\/$/, '');
  return `https://${url}`;
};
