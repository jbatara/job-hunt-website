import {
  gitHubJobsURL,
  gitHubJobsResultPrint,
  makeGiphyRequest,
  makeGithubJobsRequest,
  hackerNewsStoryRequest,
  hackerNewsBestIDRequest
} from './scripts';
import 'bootstrap';
import $ from 'jquery';
import './styles.css';

async function allRequests(keyword, location) {
  try {

    const gifPromise = makeGiphyRequest();
    const jobPromise = makeGithubJobsRequest(keyword, location);
    const bestIDPromise = await hackerNewsBestIDRequest();
    let bestIDs = await JSON.parse(bestIDPromise);
    bestIDs = bestIDs.slice(0,50);
    let allStoryPromises = bestIDs.map(function(id) {
      return hackerNewsStoryRequest(id);
    });

    const job = await jobPromise;
    const gif = await gifPromise;

    let stories = await allStoryPromises;
    let storiesHTML = '';

    for(let i = 0; i<stories.length;i++){
      const promise = await stories[i];
      const story = JSON.parse(promise);
      const number = i+1;
      storiesHTML += `<p>` + number + `. <a href='${story.url}'>${story.title}</a></p>`;
    }
    $('#news').html(storiesHTML);
    debugger;
    let gifBody = JSON.parse(gif);
    $('#gif').html(`<img src='${gifBody.data[(Math.floor(Math.random()*gifBody.data.length))].images.downsized.url}'>`);

    let jobBody = JSON.parse(job);
    let jobHTML = '';
    jobBody.forEach(function(job, i) {
      jobHTML += gitHubJobsResultPrint(job, i);
    });
    $('#jobs').html(jobHTML);

  } catch (e) {
    console.log('error');
  }
}

$(document).ready(function(event) {
  $('#jobSearch').submit(function(event) {
    event.preventDefault();
    let keyword = $('input[name=keyword]').val();
    let location = $('input[name=location]').val();

    allRequests(keyword, location).then(function(){
      $('div').show();
    });

  });
});
