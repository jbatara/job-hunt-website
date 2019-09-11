import {
  gitHubJobsURL,
  gitHubJobsResultPrint
} from './scripts';
import 'bootstrap';
import $ from 'jquery';
import './styles.css';


$(document).ready(function(event) {
  $('#jobSearch').submit(function(event) {
    event.preventDefault();
    let keyword = $('input[name=keyword]').val();
    let location = $('input[name=location]').val();

    let promise = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let url = gitHubJobsURL(keyword, location);
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", url, true);
      request.send();
    });

    let promise2 = new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      let urlGiphy = `https://api.giphy.com/v1/gifs/search?q=motivational&api_key=${process.env.API_KEY}`;
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET", urlGiphy, true);
      request.send();
    });

    function bestStoryIDs() {
      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let urlNews = `https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`;
        request.onload = function() {
          if (this.status === 200) {
            resolve(request.response);
          } else {
            reject(Error(request.statusText));
          }
        }
        request.open("GET", urlNews, true);
        request.send();
      });
    }

    function newsStory(id) {
      return new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        let urlNewStory = `https://hacker-news.firebaseio.com/v0/item/` + id + `.json?print=pretty`;

        request.onload = function() {
          if (this.status === 200) {
            resolve(request.response);
          } else {
            reject(Error(request.statusText));
          }
        }
        request.open("GET", urlNewStory, true);
        request.send();
      });
    }

    promise.then(function(response) {
      let body = JSON.parse(response);
      let output = '';
      body.forEach(function(job, i) {
        output += gitHubJobsResultPrint(job, i);
      });
      $('#jobs').html(output);
    }, function(error) {
      $('.error').append(`There was an error processing your request: ${error.message}`);
    });

    promise2.then(function(response) {
      let body = JSON.parse(response);
      $('#gif').html(`<img src='${body.data[(Math.floor(Math.random()*body.data.length))].images.downsized.url}'>`);
    }, function(error) {
      $('.error').append(`There was an error processing your request: ${error.message}`);
    });

    bestStoryIDs().then(function(response) {
      let ids = JSON.parse(response);
      let htmlArray = [];
      for (let i = 0; i < 50; i++) {
        let number = i + 1;
        newsStory(ids[i]).then(function(response) {
          let story = JSON.parse(response);
          htmlArray.push(`<p>` + number + `. <a href='${story.url}'>${story.title}</a></p>`);
        });
      }
      setTimeout(function() {
        let sortedHtml = htmlArray.sort(function(a, b) {
          return parseInt(String(a.charAt(3) + a.charAt(4))) - parseInt(String(b.charAt(3) + b.charAt(4)))
        });
        let output = '';
        sortedHtml.forEach(function(story) {
          output+=story;
        });
        $('.news').html(output);
        $('div').show();
      }, 500);
    });
  });
});
