// Create a full-stack application with Express, MySQL and Handlebars.
// HINT: this web application will be very similar to the app your instructor just demonstrated and slacked out. Please feel free to leverage that code when creating this code.
// Create a schema.sql file. Inside of that file, do the following:
// Make a database called moviePlannerDB
// Inside of that database make a movies table which will contain a movie column and an id column. The id will be automatically incremented while also being the primary key.
// Run your schema.sql file within MySQL Workbench before moving onto the next steps.
// In your server.js file, you will create four routes: get, post, put, and delete.
// Render the main index.handlebars when the '/' get route is hit with all of the movies from the movies table.
// Your application should have a set of routes on '/movies' for create, update, and delete operations on the movies table.
// Show a delete button next to each movie. When one of the delete buttons is clicked, the code should send a DELETE request to delete the associated movie from your database.
// Additionally, show the form that the user can use to add a movie to be watched. When the submit button is clicked, the code will post to the '/movies' route, which will insert the movie from the form into the movies table and return the ID of the new movie.
// Have another form that will update a movie in the movies table. The form will include two inputs: an id input and a movie title input. Remember to leverage a PUT method.
// Remember: best practices for REST include:
// Put your REST API on it's own URL (e.g. '/todos').
// A POST that creates an item should return the ID of the item it created.
// PUT and DELETE should specify the ID of the item they're intended to affect in the URL (e.g. '/todos/123').
// If the ID for the item specified in a PUT or DELETE couldn't be found, return a 404.
// If an error occurs in the server, return an error code (e.g. 500).

const express = require("express");
const exphbs = require("express-handlebars");
const mysql = require("mysql");
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "root",
    database: "movieplannerdb"
});

connection.connect(function (err) {
    if (err) {
        console.error("Error connecting: " + err.stack);
        return;
    }

    console.log("Connected as id " + connection.threadId);
});

app.get("/", function (req, res) {
    connection.query("SELECT * FROM movies;", function (err, data) {
        if (err) {
            return res.status(500).end();
        }

        res.render("index", { movies: data });
    });
});
// Add (create) a new movie
app.post("/api/movies", function (req, res) {
    connection.query("INSERT INTO movies (movie) VALUES (?)", [req.body.movie], function (err, result) {
        if (err) {
            return res.status(500).end();
        };
        res.json({ id: result.insertId });
        console.log({ id: result.insertId });
    });
});
// Update a movie
app.put("/api/movies/:id", function (req, res) {
    connection.query("UPDATE movies SET movie = ? WHERE id = ?", [req.body.movie, req.params.id], function (err, result) {
        if (err) {
            return res.status(500).end();
        }
        else if (result.changedRows === 0) {
            return res.status(404).end();
        };
        res.status(200).end();
    });
});
// Delete a movie
app.delete("/api/movies/:id", function (req, res) {
    connection.query("DELETE FROM movies WHERE id = ?", [req.params.id], function (err, result) {
        if (err) {
            return res.status(500).end();
        }
        else if (result.affectedRows === 0) {
            return res.status(404).end();
        };
        res.status(200).end();
    });
});

app.listen(PORT, function () {
    console.log("Listing movies on: " + PORT);
});