// BFS functions to work in the MovieRecomndations
const extractTitleWithoutYear = (title) => {
    const match = title.match(/^(.*?)(?:\s\(\d{4}\))?$/);
    return match ? match[1].trim() : title.trim();
  };
export const buildGenreGraph = (movies) => {
    const genreIndex = {};
    const graph = {};
  
    movies.forEach((movie) => {
      const normalizedTitle = extractTitleWithoutYear(movie.title).toLowerCase();
      const genres = movie.genres.split('|');
  
      genres.forEach((genre) => {
        const genreKey = genre.trim().toLowerCase();
        if (!genreIndex[genreKey]) genreIndex[genreKey] = [];
        genreIndex[genreKey].push(normalizedTitle);
      });
    });
  
    Object.values(genreIndex).forEach((moviesInGenre) => {
      moviesInGenre.forEach((movie1) => {
        moviesInGenre.forEach((movie2) => {
          if (movie1 !== movie2) {
            if (!graph[movie1]) graph[movie1] = [];
            graph[movie1].push(movie2);
          }
        });
      });
    });
  
    return graph;
  };
  
  export const bfsRecommendations = (graph, startMovie, movies, maxDepth = 499) => {
    const normalizedStart = startMovie.trim().toLowerCase();
    const visited = new Set();
    const queue = [[normalizedStart, 0]];
    const recommendations = [];
  
    while (queue.length) {
      const [current, depth] = queue.shift();
      if (depth > maxDepth) break;
  
      if (!visited.has(current)) {
        visited.add(current);
        recommendations.push(current);
  
        (graph[current] || []).forEach((neighbor) => {
          if (!visited.has(neighbor)) queue.push([neighbor, depth + 1]);
        });
      }
    }
  
    return movies
      .filter((movie) => recommendations.includes(extractTitleWithoutYear(movie.title).toLowerCase()))
      .sort((a, b) => b.average_rating - a.average_rating)
      .map((movie) => ({
        title: movie.title,
        genres: movie.genres,
        rating: movie.average_rating,
      }));
  };
  
  export const searchByGenres = (movies, genres) => {
    const lowerGenres = genres.map((g) => g.trim().toLowerCase());
    return movies
      .filter((movie) =>
        lowerGenres.every((genre) => movie.genres.toLowerCase().includes(genre))
      )
      .sort((a, b) => b.average_rating - a.average_rating)
      .map((movie) => ({
        title: movie.title,
        genres: movie.genres,
        rating: movie.average_rating,
      }));
  };
  