const express = require("express");
const app = express();
const PORT = 3000; // You can choose any port you like

// This middleware allows Express to parse incoming JSON requests
app.use(express.json());

const movies = [
  { id: 1, title: "Jaws", year: 1975, rating: 8 },
  { id: 2, title: "Avatar", year: 2009, rating: 7.8 },
  { id: 3, title: "Brazil", year: 1985, rating: 8 },
  { id: 4, title: "الإرهاب والكباب", year: 1992, rating: 6.2 },
];
const orderMovies = (key) => {
  return movies.slice().sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
};

// Function to generate a unique ID for a new movie
const generateUniqueId = () => {
  return Math.max(...movies.map((movie) => movie.id), 0) + 1;
};

// Function to add a new movie to the movies array
const addMovie = (title, year, rating) => {
  const id = generateUniqueId();
  const newMovie = { id, title, year, rating };
  movies.push(newMovie);
  return newMovie;
};

const findMovieById = (id) => {
  return movies.findIndex((movie) => movie.id === parseInt(id));
};

const deleteMovieById = (id) => {
  const index = findMovieById(id);
  if (index !== -1) {
    movies.splice(index, 1);
    return true;
  }
  return false;
};

const updateMovieById = (id, title, rating) => {
  const index = findMovieById(id);
  if (index !== -1) {
    if (title) {
      movies[index].title = title;
    }
    if (rating) {
      movies[index].rating = parseFloat(rating);
    }
    return true;
  }
  return false;
};

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
app.get("/movies", (req, res) => {
  let moviesData = movies.slice(); // Create a copy of the movies array

  // Sorting based on query parameter 'sort'
  const sortBy = req.query.sort;
  if (sortBy) {
    moviesData = orderMovies(sortBy);
  }

  res.status(200).json({ status: 200, data: moviesData });
});

app.post("/movies", (req, res) => {
  const { title, year, rating } = req.body;

  if (!title || !year || !rating) {
    res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide title, year, and rating for the movie.",
    });
    return;
  }

  const newMovie = addMovie(title, parseInt(year), parseFloat(rating));
  res.status(201).json({ status: 201, data: newMovie });
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({
      status: 400,
      error: true,
      message: "Please provide a valid movie ID.",
    });
    return;
  }

  const isDeleted = deleteMovieById(id);
  if (isDeleted) {
    res.status(200).json({ status: 200, data: movies });
  } else {
    res.status(404).json({
      status: 404,
      error: true,
      message: `The movie with ID ${id} does not exist`,
    });
  }
});

app.put("/movies/:id", (req, res) => {
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

  const isUpdated = updateMovieById(id, title, rating);
  if (isUpdated) {
    res.status(200).json({ status: 200, data: movies });
  } else {
    res.status(404).json({
      status: 404,
      error: true,
      message: `The movie with ID ${id} does not exist`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
