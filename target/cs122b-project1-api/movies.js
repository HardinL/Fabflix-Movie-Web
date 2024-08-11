/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */

const handleMovieResult = (resultData) => {

    console.log("handleMovieResult: populating movie table from resultData");

    const movieTableBodyElement = jQuery("#movie-table-body");
    const movieCount = resultData.length;
    for (let i = 0; i < movieCount; ++i) {

        let row = "";
        row += "<tr>";
        row +=
            "<th>" +
            "<a href='single-movie.html?id=" + resultData[i]["movie-id"] + "'>" +
            resultData[i]["movie-title"] +
            "</a>" +
            "</th>";
        row += "<th>" + resultData[i]["movie-year"] + "</th>";
        row += "<th>" + resultData[i]["movie-director"] + "</th>";
        row += "<th>" + resultData[i]["movie-genres"] + "</th>";
        row += "<th>";
        const starCount = resultData[i]["star-ids"].length;
        for (let j = 0; j < starCount; ++j) {
            row +=
                "<a href='single-star.html?id=" + resultData[i]["star-ids"][j] + "'>" +
                resultData[i]["star-names"][j] +
                "</a>";
            if (j < starCount - 1) {
                row += ", ";
            }
        }
        row += "</th>";
        row += "<th>" + resultData[i]["movie-rating"] + "</th>"
        row += "</tr>";

        // Append the row created to the table body, which will refresh the page
        movieTableBodyElement.append(row);
    }
}

/**
 * Once this .js is loaded, following scripts will be executed by the browser
 */

// Makes the HTTP GET request and registers on success callback function handleMovieResult
jQuery.ajax({
    dataType: "json", // Setting return data type
    method: "GET", // Setting request method
    url: "api/movies", // Setting request url, which is mapped by MoviesServlet in MoviesServlet.java
    success: (resultData) => handleMovieResult(resultData) // Setting callback function to handle data returned successfully by the MoviesServlet
});