import React from "react";
import moviesData from '../moviesData'

class MoviesWillWatchItem extends React.Component {
  render() {
    const {title, vote_average} = this.props.data
    return (
      <li className="list-group-item">
        <div className="d-flex justify-content-between">
          <div>{title}</div>
          <div>{vote_average}</div>
        </div>
      </li>
    )
  }
}

class MoviesWillWatch extends React.Component {

  render() {
    const { data } = this.props;

    let arr = data.map((item) => {
      return (
        <MoviesWillWatchItem key={item.id} data={item} />
      )
    });

    return (
      <div className='position-fixed'>
        <h4>Will Watch: {data.length} movies</h4>
        <ul className="list-group">
          {arr.reverse()}
        </ul>
      </div>
    )
  }
}


class MovieItem extends React.Component {
    
  state = {
      watchLater: false,
    }

  handleClick = () => {
    const { data } = this.props;
    this.setState({watchLater: !this.state.watchLater})
    if (!this.state.watchLater) {
      this.props.addMovie({id: data.id, title: data.title, vote_average: data.vote_average })
    } else {
      this.props.addMovie({id: data.id})
    }
  }

  render() {
    const { data } = this.props;
    return (
      <div className='col-4 mb-4'>
        <div className="card text-white bg-secondary">
          <img
            className="card-img-top"
            src={`https://image.tmdb.org/t/p/w500${data.backdrop_path || data.poster_path}`}
            alt="img"
          />
          <div className="card-body">
            <h6 className="card-title">{data.title}</h6>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Rating: {data.vote_average}</p>
              <button type="button" className={this.state.watchLater ? "btn btn-success" : "btn btn-danger"} onClick={this.handleClick}>
                Will Watch
            </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class MovieList extends React.Component {

  renderMovies = () => {
    const { data } = this.props;
    let moviesArray = null;

    if (data.length) {
      moviesArray = data.map((movie) => {
        return <MovieItem key={movie.id} data={movie} addMovie={this.props.onAddMovies} />;
      });
    } else {
      moviesArray = <p>К сожалению фильмов нет!</p>
    }
    return moviesArray;
  }
  render() {
    return (
      <React.Fragment>
        {this.renderMovies()}
      </React.Fragment>
    );
  }
}


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      movies: moviesData,
      moviesWillWatch: [],
    }
  }

  handleAddMovie = (data) => {
    let nextMovies = [];
    if (Object.keys(data).length > 1) {
      nextMovies = [data, ...this.state.moviesWillWatch];
      this.setState({ moviesWillWatch: nextMovies })
    } else {
      nextMovies = this.state.moviesWillWatch.filter((item) => item.id != data.id);
      this.setState({ moviesWillWatch: nextMovies })
    }
  }

  render() {
    const { movies, moviesWillWatch } = this.state;
    return (
      <div className='container'>
        <div className='row mt-4'>
          <div className='col-9'>
            <div className='row'>
              <MovieList data={movies} onAddMovies={this.handleAddMovie} />
            </div>
          </div>
          <div className='col-3'>
            <MoviesWillWatch data={moviesWillWatch} />
          </div>
        </div>
      </div>
    )
  }
}

export default App;