const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/movieDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a movie schema
const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  rating: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

// This middleware allows Express to parse incoming JSON requests
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ok");
});

app.get("/test", (req, res) => {
  res.status(200).json({ status: 200, message: "ok" });
});

app.get("/time", (req, res) => {
  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  res.status(200).json({ status: 200, message: currentTime });
});

// Route to handle /hello/<ID>
app.get("/hello/:id?", (req, res) => {
  const { id } = req.params;
  const message = id ? `Hello, ${id}` : "Hello, World!";
  res.status(200).json({ status: 200, message });
});

// Route to handle /search?s=<SEARCH>
app.get("/search", (req, res) => {
  const searchQuery = req.query.s;
  if (searchQuery) {
    res.status(200).json({ status: 200, message: "ok", data: searchQuery });
  } else {
    res.status(500).json({
      status: 500,
      error: true,
      message: "You have to provide a search",
    });
  }
});

// Read all movies, with optional sorting
// like /movies?sort=title
app.get("/movies", async (req, res) => {
  let moviesData = [];

  const sortBy = req.query.sort;
  if (sortBy) {
    try {
      moviesData = await Movie.find().sort({ [sortBy]: 1 });
      res.status(200).json({ status: 200, data: moviesData });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, error: true, message: error.message });
    }
  } else {
    try {
      moviesData = await Movie.find();
      res.status(200).json({ status: 200, data: moviesData });
    } catch (error) {
      res
        .status(500)
        .json({ status: 500, error: true, message: error.message });
    }
  }
});

app.post("/movies", async (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || !year || !rating) {
    res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide title, year, and rating for the movie.",
    });
    return;
  }

  try {
    const newMovie = await Movie.create({ title, year, rating });
    res.status(201).json({ status: 201, data: newMovie });
  } catch (error) {
    res.status(500).json({ status: 500, error: true, message: error.message });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide a valid movie ID.",
    });
    return;
  }

  try {
    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (deletedMovie) {
      const moviesData = await Movie.find();
      res.status(200).json({ status: 200, data: moviesData });
    } else {
      res.status(404).json({
        status: 404,
        error: true,
        message: `The movie with ID ${id} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: true, message: error.message });
  }
});

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, rating } = req.body;

  if (!id) {
    res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide a valid movie ID.",
    });
    return;
  }

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, rating },
      { new: true }
    );

    if (updatedMovie) {
      const moviesData = await Movie.find();
      res.status(200).json({ status: 200, data: moviesData });
    } else {
      res.status(404).json({
        status: 404,
        error: true,
        message: `The movie with ID ${id} does not exist`,
      });
    }
  } catch (error) {
    res.status(500).json({ status: 500, error: true, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
