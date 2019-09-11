// keyword and location
// https://jobs.github.com/positions?description=python&location=new+york
//
//
// looks for pages of results
// https://jobs.github.com/positions.json?description=ruby&page=1
// https://jobs.github.com/positions.json?page=1&search=code


// GET /positions.json
// Search for jobs by term, location, full time vs part time, or any combination of the three. All parameters are optional.
//
// Parameters
//
// description — A search term, such as "ruby" or "java". This parameter is aliased to search.
// location — A city name, zip code, or other location search term.
// lat — A specific latitude. If used, you must also send long and must not send location.
// long — A specific longitude. If used, you must also send lat and must not send location.
// full_time — If you want to limit results to full time positions set this parameter to 'true'.
// Examples
//
// https://jobs.github.com/positions.json?description=python&full_time=true&location=sf
// https://jobs.github.com/positions.json?search=node
// https://jobs.github.com/positions.json?lat=37.3229978&long=-122.0321823

// GET /positions/ID.json
// Retrieve the JSON representation of a single job posting.
//
// Parameters
//
// markdown — Set to 'true' to get the description and how_to_apply fields as Markdown.
// Examples
//
// https://jobs.github.com/positions/21516.json
// https://jobs.github.com/positions/21516.json?markdown=true


export function gitHubJobsURL(keyWord, location) {
  let url = 'https://github-jobs-proxy.appspot.com/positions?';
  let keyWordURL = 'description=' + keyWord;
  let locationURL = "location=" + location;
  let pageURL = "page=1"
  return url + "&" + keyWordURL + "&" + locationURL;
}


export function gitHubJobsResultPrint(jobObject, i) {
  let title = "<h2 class=title>" + jobObject.title + " - " + jobObject.type + "</h2>";
  let date = "<p>" + jobObject.created_at + "</p>";
  let company = "<p class=company><a href=" + jobObject.company_url + ">" + jobObject.company + "</a></p>";
  let location = "<p class=location>" + jobObject.location + "</p>";
  let description = "<div class=description>" + jobObject.description +"</div>";
  let output = "<div class=job" + i + ">" + title + date + company + location + description + "</div>";
  return output;
}
