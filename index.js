const express = require("express");
const app = express();
const PORT = 3000; // You can choose any port you like

const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب", year: 1992, rating: 6.2 },
];

const orderMovies = (key) => {
  return movies.slice().sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
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

app.get("/movies/read", (req, res) => {
  res.status(200).json({ status: 200, data: movies });
});

app.get("/movies/create", (req, res) => {
  res.send("Movies creation route ");
});

app.get("/movies/update", (req, res) => {
  res.send("Movies update route ");
});

app.get("/movies/delete", (req, res) => {
  res.send("Movies deletion route ");
});

app.get("/movies/read", (req, res) => {
  res.status(200).json({ status: 200, data: movies });
});

app.get("/movies/read/by-date", (req, res) => {
  const moviesByDate = orderMovies("year");
  res.status(200).json({ status: 200, data: moviesByDate });
});

app.get("/movies/read/by-rating", (req, res) => {
  const moviesByRating = orderMovies("rating").reverse(); // Order by highest rating first
  res.status(200).json({ status: 200, data: moviesByRating });
});

app.get("/movies/read/by-title", (req, res) => {
  const moviesByTitle = orderMovies("title");
  res.status(200).json({ status: 200, data: moviesByTitle });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
