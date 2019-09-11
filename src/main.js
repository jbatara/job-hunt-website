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

    promise.then(function(response){
      let body = JSON.parse(response);
      console.log(body);
      let output = '';
      body.forEach(function(job,i){
        output+= gitHubJobsResultPrint(job,i);
      });
      $('.results').html(output);
    }, function(error){
      $('.error').html(`There was an error processing your request: ${error.message}`);
    });
  });
});
