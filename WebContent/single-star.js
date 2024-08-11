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
const getParameterByName = (target) => {
    // Get request URL
    const url = window.location.href;
    // Encode target parameter name to url encoding
    target = target.replace(/[\[\]]/g, "\\$&");

    // Ues regular expression to find matched parameter value
    const regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    // Return the decoded parameter value
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */
const handleResult = (resultData) => {

    console.log("handleResult: populating star info from resultData");

    // populate the star info h3
    // find the empty h3 body by id "star_info"
    const starInfoElement = jQuery("#star-info");

    // append two html <p> created to the h3 body, which will refresh the page
    starInfoElement.append("<p>Star Name: " + resultData[0]["star-name"] + "</p>" +
        "<p>Date Of Birth: " + resultData[0]["star-birth-year"] + "</p>");

    console.log("handleResult: populating movie table from resultData");

    // Populate the star table
    // Find the empty table body by id "movie_table_body"
    const movieTableBodyElement = jQuery("#movie-table-body");

    // Concatenate the html tags with resultData jsonObject to create table rows
    const movieCount = resultData[0]["movie-ids"].length;
    let row = "";
    row += "<tr>";
    row += "<th>";
    for (let i = 0; i < movieCount; ++i) {
        row +=
            "<a href='single-movie.html?id=" + resultData[0]["movie-ids"][i] + "'>" +
            resultData[0]["movie-titles"][i] +
            "</a>";
        if (i < movieCount - 1) {
            row += ", ";
        }
    }
    row += "</th>";
    row += "</tr>";

    movieTableBodyElement.append(row);
}

/**
 * Once this .js is loaded, following scripts will be executed by the browser\
 */

// Get id from URL
const starId = getParameterByName('id');

// Makes the HTTP GET request and registers on success callback function handleResult
jQuery.ajax({
    dataType: "json",  // Setting return data type
    method: "GET",// Setting request method
    url: "api/single-star?id=" + starId, // Setting request url, which is mapped by StarsServlet in Stars.java
    success: (resultData) => handleResult(resultData) // Setting callback function to handle data returned successfully by the SingleStarServlet
});