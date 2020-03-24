import React from "react";
import moviesData from "../moviesData";
import { API_URL, API_KEY_3 } from "../utils/api";

class MoviesWillWatchItem extends React.Component {
  render() {
    console.log("render", this.constructor.name);
    const { title, vote_average } = this.props.data;
    return (
      <li className="list-group-item">
        <div className="d-flex justify-content-between">
          <div>{title}</div>
          <div>{vote_average}</div>
        </div>
      </li>
    );
  }
}

class MoviesWillWatch extends React.Component {
  render() {
    console.log("render", this.constructor.name);
    const { data } = this.props;

    let watchLater = data.map(item => {
      return <MoviesWillWatchItem key={item.id} data={item} />;
    });

    return (
      <div className="position-fixed">
        <h4>Will Watch: {data.length} movies</h4>
        <ul className="list-group">{watchLater}</ul>
      </div>
    );
  }
}

class MovieItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      watchLater: false
    };
  }

  handleClick = e => {
    const { data } = this.props;
    const { watchLater } = this.state;

    if (e.currentTarget.id === "delete") {
      this.props.operateMovieItem({ id: data.id, delete: true });
    } else {
      this.setState({ watchLater: !watchLater });

      if (!watchLater) {
        this.props.operateMovieItem({
          id: data.id,
          title: data.title,
          vote_average: data.vote_average
        });
      } else {
        this.props.operateMovieItem({ id: data.id });
      }
    }
  };

  render() {
    console.log("render", this.constructor.name);
    const { data } = this.props;
    const { watchLater } = this.state;
    return (
      <div className="col-4 mb-4">
        <div className="card text-white bg-secondary">
          <img
            className="card-img-top"
            src={`https://image.tmdb.org/t/p/w500${data.backdrop_path ||
              data.poster_path}`}
            alt="img"
          />
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="card-title">{data.title}</h6>
              <p>Rating: {data.vote_average}</p>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <button
                type="button"
                className={watchLater ? "btn btn-success" : "btn btn-danger"}
                onClick={this.handleClick}
              >
                {!watchLater ? "Will watch" : "Remove"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                id="delete"
                onClick={this.handleClick}
              >
                Delete
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
      moviesArray = data.map(movie => {
        return (
          <MovieItem
            key={movie.id}
            data={movie}
            operateMovieItem={this.props.onAddMovies}
          />
        );
      });
    } else {
      moviesArray = <p>К сожалению фильмов нет!</p>;
    }
    return moviesArray;
  };
  render() {
    console.log("render", this.constructor.name);
    return <React.Fragment>{this.renderMovies()}</React.Fragment>;
  }
}

class MovieTabs extends React.Component {
  handleOnChange = e => {
    this.props.updateSortBy(e.currentTarget.value);
  };

  render() {
    console.log('render', this.constructor.name);
    return (
      <form className="mb-3">
        <div className="form-group">
          <label htmlFor="sort_by">Сортировать по:</label>
          <select
            className="form-control"
            id="sort_by"
            onChange={this.handleOnChange}
          >
            <option value="popularity.desc">Популярные по убыванию</option>
            <option value="popularity.asc">Популярные по возростанию</option>
            <option value="vote_average.desc">Рейтинг по убыванию</option>
            <option value="vote_average.asc">Рейтинг по возростанию</option>
          </select>
        </div>
      </form>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      movies: [],
      // moviesData
      moviesWillWatch: [],
      sort_by: "popularity.desc",
      page: 1,
    };
  }

  getMovies = () => {
    fetch(
      `${API_URL}/discover/movie?api_key=${API_KEY_3}&sort_by=${this.state.sort_by}&page=${this.state.page}`
    )
      .then(resp => resp.json())
      .then(data => this.setState({ movies: data.results }))
      .catch(err => console.error(err));
  };

  componentDidMount() {
    this.getMovies();
  }

  componentDidUpdate(prevProps, nextState) {
    if (nextState.sort_by !== this.state.sort_by) {
      this.setState({page: 1})
      this.getMovies();
    }
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.page !== this.state.page) {
      return false;
    }
    return true;
  }

  handleAddMovie = data => {
    if (data.delete) {
      this.setState({
        movies: this.state.movies.filter(item => item.id !== data.id),
        moviesWillWatch: this.state.moviesWillWatch.filter(
          item => item.id !== data.id
        )
      });
      return;
    } else if (Object.keys(data).length > 1) {
      this.setState({
        moviesWillWatch: [...this.state.moviesWillWatch].concat(data)
      });
    } else {
      this.setState({
        moviesWillWatch: this.state.moviesWillWatch.filter(
          item => item.id !== data.id
        )
      });
    }
  };

  updateSortBy = value => {
    this.setState({ sort_by: value });
  };

  getPreviousPage = () => {
    if (this.state.page !== 1) {
      this.setState({page: --this.state.page});
      this.getMovies()
    }
    return;
  }
  getNextPage = () => {
      this.setState({page: ++this.state.page});
      this.getMovies()
  }

  render() {
    console.log("render", this.constructor.name);
    const { movies, moviesWillWatch } = this.state;
    return (
      <div className="container">
        <div className="row mt-4">
          <div className="col-9">
            <div className="row">
              <div className="col-12">
                <MovieTabs updateSortBy={this.updateSortBy} />
              </div>
              <MovieList data={movies} onAddMovies={this.handleAddMovie} />
            </div>
          </div>
          <div className="col-3">
            <MoviesWillWatch data={moviesWillWatch} />
          </div>
        </div>
        <div className="row mb-4">
          <div className="col-5">
          <button
                type="button"
                className="btn btn-primary mx-auto"
                style={{display: 'block'}}
                onClick={this.getPreviousPage}
              >Previous page</button>
          </div>
          <div className="col-5">
          <button
                type="button"
                className="btn btn-primary mx-auto"
                style={{display: 'block'}}
                onClick={this.getNextPage}
              >Next page</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
