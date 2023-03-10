const port = process.env.port || 8000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const app = express();
const newspapers = [
  {
    name: "thetimes",
    address: "https://www.thetimes.co.uk/environment/climate-change",
    base: "",
  },
  {
    name: "theguardian",
    address: "https://www.theguardian.com/environment/climate-crisis",
    base: "",
  },
  {
    name: "telegraph",
    address: "https://www.telegraph.co.uk/climate-change/",
    base: "https://www.telegraph.co.uk",
  },
  {
    name: "independent",
    address: "https://www.independent.co.uk/environment/climate-change/",
    base: "https://www.independent.co.uk",
  },
  {
    name: "bbc",
    address: "https://www.bbc.co.uk/news/topics/cp8xg0g3zvgt/climate-change",
    base: "https://www.bbc.co.uk",
  },
  {
    name: "dm",
    address:"https://www.dailymail.co.uk/home/search.html?sel=site&searchPhrase=climate+change",
    base: "https://www.dailymail.co.uk",
  },
  {
    name: "express",
    address: "https://www.express.co.uk/search?query=climate+change",
    base: "https://www.express.co.uk",
  },
  {
    name: "mirror",
    address: "https://www.mirror.co.uk/all-about/climate-change",
    base: "https://www.mirror.co.uk",
  },
  {
    name: "sky",
    address: "https://news.sky.com/climate-change",
    base: "https://news.sky.com",
  },
  {
    name: "standard",
    address: "https://www.standard.co.uk/topic/climate-change",
    base: "https://www.standard.co.uk",
  },
  {
    name: "sun",
    address: "https://www.thesun.co.uk/topic/climate-change/",
    base: "https://www.thesun.co.uk",
  },
];
const articles = [];
newspapers.forEach((newspaper) => {
  axios
    .get(newspaper.address)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      $('a:contains("climate")').each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        articles.push({
          title,
          url: newspaper.base + url,
          source: newspaper.name,
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});
app.get("/", (req, res) => {
  res.json("Welcome to my API!");
});
app.get("/news", (req, res) => {
  res.json(articles);
});
app.get("/news/:newspaperId", (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newspaperAddress = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].address;
  const newspaperBase = newspapers.filter(
    (newspaper) => newspaper.name === newspaperId
  )[0].base;
  axios
    .get(newspaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticles = [];
      $('a:contains("climate")', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr("href");
        specificArticles.push({
          title,
          url: newspaperBase + url,
          source: newspaperId,
        });
      });
      res.json(specificArticles);
    })
    .catch((err) => {
      console.log(err);
    });
});
app.listen(port, () => console.log(`Listening on port ${port}`));
