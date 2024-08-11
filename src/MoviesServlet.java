import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import javax.naming.InitialContext;
import javax.naming.NamingException;

import com.google.gson.JsonPrimitive;
import jakarta.servlet.ServletConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.logging.Logger;

// Declaring a WebServlet called SingleStarServlet, which maps to url "/api/single-star"
@WebServlet(name = "MoviesServlet", urlPatterns = "/api/movies")
public class MoviesServlet extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(MoviesServlet.class.getName());

    private static final long serialVersionUID = 3L;

    // Create a dataSource which registered in web.
    private DataSource dataSource;

    public void init(ServletConfig config) {

        LOGGER.info("Connecting to database: moivedb");
        try {
            dataSource = (DataSource) new InitialContext().lookup("java:comp/env/jdbc/moviedb");
        } catch (NamingException e) {
            LOGGER.info("Connection failed");
            LOGGER.info(e.getMessage());
            LOGGER.info(String.valueOf(e.getStackTrace()));
        }
    }

    /**
     * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
     */
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        LOGGER.info("Fetching movies");
        response.setContentType("application/json"); // Response mime type

        // Output stream to STDOUT
        PrintWriter out = response.getWriter();

        try (Connection conn = dataSource.getConnection()) {

            // Declare our statement
            Statement statement = conn.createStatement();

            String query = "SELECT " +
                                "m.id AS m_id, " +
                                "m.title AS m_title, " +
                                "m.year AS m_year, " +
                                "m.director AS m_director, " +
                                "SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT g.name SEPARATOR ', '), ', ', 3) AS m_genres, " +
                                "SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT s.id ORDER BY s.id SEPARATOR ', '), ', ', 3) AS s_ids, " +
                                "SUBSTRING_INDEX(GROUP_CONCAT(DISTINCT s.name ORDER BY s.id SEPARATOR ', '), ', ', 3) AS s_names, " +
                                "r.rating AS rating " +
                            "FROM " +
                                "movies m " +
                            "LEFT JOIN " +
                                "ratings r ON r.movieId = m.id " +
                            "LEFT JOIN " +
                                "genres_in_movies gim ON gim.movieId = m.id " +
                            "LEFT JOIN " +
                                "genres g ON g.id = gim.genreId " +
                            "LEFT JOIN " +
                                "stars_in_movies sim ON sim.movieId = m.id " +
                            "LEFT JOIN " +
                                "stars s ON s.id = sim.starId " +
                            "GROUP BY " +
                                "m.id, r.rating " +
                            "ORDER BY " +
                                "r.rating DESC " +
                            "LIMIT 20";

            // Perform the query
            ResultSet resultSet = statement.executeQuery(query);

            JsonArray jsonArray = new JsonArray();

            // Iterate through each row of resultSet
            while (resultSet.next()) {

                String movieId = resultSet.getString("m_id");
                String movieTitle = resultSet.getString("m_title");
                String movieYear = resultSet.getString("m_year");
                String movieDirector = resultSet.getString("m_director");
                String movieGenres = resultSet.getString("m_genres");
                String[] starIds = resultSet.getString("s_ids").split(", ");
                String[] starNames = resultSet.getString("s_names").split(", ");
                String movieRating = resultSet.getString("rating");

                // Create a JsonObject based on the data we retrieve from resultSet
                JsonObject jsonObject = new JsonObject();
                jsonObject.addProperty("movie-id", movieId);
                jsonObject.addProperty("movie-title", movieTitle);
                jsonObject.addProperty("movie-year", movieYear);
                jsonObject.addProperty("movie-director", movieDirector);
                jsonObject.addProperty("movie-genres", movieGenres);

                JsonArray starIdJsonArray = new JsonArray();

                for (String starId : starIds) {
                    starIdJsonArray.add(new JsonPrimitive(starId));
                }

                jsonObject.add("star-ids", starIdJsonArray);

                JsonArray starNameJsonArray = new JsonArray();

                for (String starName : starNames) {
                    starNameJsonArray.add(new JsonPrimitive(starName));
                }

                jsonObject.add("star-names", starNameJsonArray);
                jsonObject.addProperty("movie-rating", movieRating);

                jsonArray.add(jsonObject);
            }

            resultSet.close();
            statement.close();

            // Log to localhost log
            request.getServletContext().log("getting " + jsonArray.size() + " movies");

            // Write JSON string to output
            out.write(jsonArray.toString());
            // Set response status to 200 (OK)
            response.setStatus(200);

        } catch (Exception e) {

            // Write error message JSON object to output
            JsonObject jsonObject = new JsonObject();
            jsonObject.addProperty("error", e.getMessage());
            out.write(jsonObject.toString());

            // Set response status to 500 (Internal Server Error)
            response.setStatus(500);
        } finally {
             out.close();
        }
    }
}
