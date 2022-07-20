"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const altImage = "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300";


/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchTerm) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showResponse = await axios.get("http://api.tvmaze.com/search/shows",
    { params: { q: searchTerm } });

  return showResponse.data.map(response => {  // tried to use .filter, but .map works instead because it will change every array index value
    return {
      id: response.show.id,
      name: response.show.name,
      summary: response.show.summary,
      image: response.show.image ? response.show.image.medium : altImage
    };
  });

  // have to use ternary because you can't use if statement here
  // tried to do response.show.image.medium || altImage but if there's no image, there was no category for response.show.image.medium
  // set alternate image URL to a constant because it's too long and makes code messy
}



/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {   // don't forget to look at API and be sure of how to access data (show.show.id)
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image}"
              alt="${show.name} photo"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  return response.data.map(episode => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number
    };
  });


}

/** given list episodes, creates markup for each episode and append to DOM */

function populateEpisodes(episodes) {
  const $episodesList = $('#episodesList');
  for (let episode of episodes) {
    const $episode = $(`<li>${episode.name} (season ${episode.season},
      number ${episode.number})</li>`);
    $episodesList.append($episode);
  }
  $episodesArea.show();
}


async function searchForEpisodesAndDisplay (){
  const id = "something"
  const episodes = getEpisodesOfShow(id);
  populateEpisodes (episodes);
}


$episodeBtn = $('.Show-getEpisodes');

$episodeBtn.on('click', async function (e){
  e.preventDefault();
  const $target = $(e.target).closest('.Show').data('show-id');
  await searchForEpisodesAndDisplay();

})