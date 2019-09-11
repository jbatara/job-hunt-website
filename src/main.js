import {gitHubJobsURL, gitHubJobsResultPrint} from './scripts';
import 'bootstrap';
import $ from 'jquery';


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
      request.open("GET",url,true);
      request.send();
    });

    let promise2 = new Promise(function(resolve, reject){
      let request = new XMLHttpRequest();
      let urlGiphy = `https://api.giphy.com/v1/gifs/search?q=motivational&api_key=${process.env.API_KEY}`
      request.onload = function() {
        if (this.status === 200) {
          resolve(request.response);
        } else {
          reject(Error(request.statusText));
        }
      }
      request.open("GET",urlGiphy,true);
      request.send();
    });


    promise.then(function(response){
      let body = JSON.parse(response);
      let output = '';
      body.forEach(function(job,i){
        output+= gitHubJobsResultPrint(job,i);
      });
      $('.results').append(output);
    }, function(error){
      $('.error').append(`There was an error processing your request: ${error.message}`);
    });

    promise2.then(function(response){
      let body = JSON.parse(response);
        $('.results').append(`<img src='${body.data[(Math.floor(Math.random()*body.data.length))].images.downsized.url}'>` );
      }, function(error){
          $('.error').append(`There was an error processing your request: ${error.message}`);
      });
  });
});
