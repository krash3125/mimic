from bs4 import BeautifulSoup
import requests


url = "https://www.dropbox.com/"
req = requests.get(url)

soup = BeautifulSoup(req.content, "html.parser")

print(soup.title)
