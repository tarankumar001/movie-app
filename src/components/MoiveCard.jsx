// 🔹 Import React (needed to use JSX)
import React from 'react';

// 🔹 MovieCard Component
// It receives a movie object as props
// Props = data passed from parent component (like App)
const MovieCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  // destructuring → we directly get title, vote_average etc. from movie object

  return (
    <div className="movie-card">
      {/* Movie poster image */}
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}` // if poster exists, show it
            : '/no-movie.png' // if not, show default image
        }
        alt={title} // alt text for accessibility
      />

      {/* Movie info section */}
      <div className="mt-4">
        {/* Movie title */}
        <h3>{title}</h3>

        {/* Rating, language, year */}
        <div className="content">
          {/* Rating with star icon */}
          <div className="rating">
            <img src="star.svg" alt="star Icon" /> {/* Star icon */}
            <p>
              {vote_average ? vote_average.toFixed(1) : 'N/A'}
              {/* vote_average → if exists, show 1 decimal (like 8.3)
                  if missing, show 'N/A' */}
            </p>
          </div>

          <span>•</span> {/* Just a dot separator */}

          {/* Original language */}
          <p className="lang">{original_language}</p>

          <span>•</span> {/* Another dot */}

          {/* Release year */}
          <p className="year">
            {release_date ? release_date.split('-')[0] : 'N/A'}
            {/* release_date is like '2023-08-12'
                split by '-' → take first part = year
                if missing → 'N/A' */}
          </p>
        </div>
      </div>
    </div>
  );
};

// 🔹 Export component so App can use it
export default MovieCard;
