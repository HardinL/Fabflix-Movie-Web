/**
 * This example is following frontend and backend separation.
 *
 * Before this .js is loaded, the html skeleton is created.
 *
 * This .js performs three steps:
 *      1. Get parameter from request URL so it know which id to look for
 *      2. Use jQuery to talk to backend API to get the json data.
 *      3. Populate the data to correct html elements.
 */


/**
 * Retrieve parameter from request URL, matching by parameter name
 * @param target String
 * @returns {*}
 */
function getParameterByName(target) {
    let url = window.location.href;
    target = target.replace(/[\[\]]/g, "\\$&");

    let regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
function handleResult(resultData) {
    console.log("handleResult: populating movie info from resultData");

    // Populate the movie info
    let movieInfoElement = jQuery("#movie_info");

    movieInfoElement.append("<p>Title: " + resultData[0]["movie_title"] + "</p>" +
        "<p>Year: " + resultData[0]["movie_year"] + "</p>" +
        "<p>Director: " + resultData[0]["movie_director"] + "</p>" +
        "<p>Genres: " + resultData[0]["genre_name"] + "</p>" +
        "<p>Rating: " + resultData[0]["movie_rating"] + "</p>");

    // // Populate genres
    // let genresElement = jQuery("#movie_genres");
    // resultData["genres"].forEach(genre => {
    //     genresElement.append("<span class='genre'>" + genre.name + "</span>");
    // });

    // Populate stars
    console.log("handleResult: populating star table from resultData");

    let starsElement = jQuery("#movie_stars");

    let starsRow = "<tr>";
    // for (let i = 0; i < resultData[0]["star_id"].length; i++) {
    //     let sid = resultData[0]["star_id"][i];
    //     let sname = resultData[0]["star_name"][i];
    //     starsRow += "<td><a href='single-star.html?id=" + sid + "'>" + sname + "</a></td>";
    // }
    // starsRow += "</tr>";
    //
    // starsElement.append(starsRow)
    for (let i = 0; i < resultData[0]["star_id"].length; i++) {
        let sid = resultData[0]["star_id"][i];
        let sname = resultData[0]["star_name"][i];
        // Create a new row for each star
        let starRow = "<tr><td><a href='single-star.html?id=" + sid + "'>" + sname + "</a></td></tr>";
        // Append the new row to the table
        starsElement.append(starRow);
    }
}

// Get movieId from URL
let movieId = getParameterByName('id');

// Makes the HTTP GET request and registers on success callback function handleResult
jQuery.ajax({
    dataType: "json",
    method: "GET",
    url: "api/single-movie?id=" + movieId,
    success: (resultData) => handleResult(resultData)
});