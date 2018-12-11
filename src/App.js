import React from 'react';
import { BrowserRouter as Router, Route, Link, NavLink } from 'react-router-dom';
import { Container, Table, Grid, Image } from 'semantic-ui-react';

const Menu = () => (
  <div>
    <NavLink
      exact
      to="/"
      activeStyle={{
        fontWeight: 'bold',
        color: 'red'
      }}
    >
      anecdotes
    </NavLink>&nbsp;
    <NavLink
      to="/create"
      activeStyle={{
        fontWeight: 'bold',
        color: 'red'
      }}
    >
      create new
    </NavLink>&nbsp;
    <NavLink
      to="/about"
      activeStyle={{
        fontWeight: 'bold',
        color: 'red'
      }}
    >
      about
    </NavLink>&nbsp;
  </div>
);

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <Table striped celled>
      <Table.Body>
        {anecdotes.map(anecdote => (
          <Table.Row key={anecdote.id}>
            <Table.Cell>
              <Link to={`/anecdote/${anecdote.id}`}>{anecdote.content}</Link>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>
);

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>
        {anecdote.content} by {anecdote.author}
      </h2>
      <br />
      <div>has {anecdote.votes} votes</div>
      <br />
      <div>for more info see {anecdote.info}</div>
      <br />
    </div>
  );
};

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <Grid>
      <Grid.Column width={9}>
        <p>According to Wikipedia:</p>
        <em>
          An anecdote is a brief, revealing account of an individual person or an incident. Occasionally humorous,
          anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a
          truth more general than the brief tale itself, such as to characterize a person by delineating a specific
          quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details
          of a short narrative. An anecdote is "a story with a point."
        </em>
      </Grid.Column>
      <Grid.Column width={5}>
        <Image src="http://www.bafta.org/sites/default/files/styles/news_main/public/externals/69827f740e5eb76041a52b02ee7cb1da.jpg?itok=YEy3DXak" />
      </Grid.Column>
    </Grid>
  </div>
);

const Footer = () => (
  <div>
    Anecdote app for <a href="https://courses.helsinki.fi/fi/TKT21009/121540749">Full Stack -sovelluskehitys</a>. See{' '}
    <a href="https://github.com/mluukkai/routed-anecdotes">https://github.com/mluukkai/routed-anecdotes</a> for the
    source code.
  </div>
);

class CreateNew extends React.Component {
  constructor() {
    super();
    this.state = {
      content: '',
      author: '',
      info: ''
    };
  }

  handleChange = e => {
    console.log(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.addNew({
      content: this.state.content,
      author: this.state.author,
      info: this.state.info,
      votes: 0
    });
    this.props.notify(`a new anecdote ${this.state.content} created!`);
    this.props.history.push('/');
  };

  render() {
    return (
      <div>
        <h2>create a new anecdote</h2>
        <form onSubmit={this.handleSubmit}>
          <div>
            content
            <input name="content" value={this.state.content} onChange={this.handleChange} />
          </div>
          <div>
            author
            <input name="author" value={this.state.author} onChange={this.handleChange} />
          </div>
          <div>
            url for more info
            <input name="info" value={this.state.info} onChange={this.handleChange} />
          </div>
          <button>create</button>
        </form>
      </div>
    );
  }
}

class App extends React.Component {
  constructor() {
    super();

    this.state = {
      anecdotes: [
        {
          content: 'If it hurts, do it more often',
          author: 'Jez Humble',
          info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
          votes: 0,
          id: '1'
        },
        {
          content: 'Premature optimization is the root of all evil',
          author: 'Donald Knuth',
          info: 'http://wiki.c2.com/?PrematureOptimization',
          votes: 0,
          id: '2'
        }
      ],
      notification: ''
    };
  }

  addNew = anecdote => {
    console.log('UUSI ANEKDOOTTI ON', anecdote);
    anecdote.id = (Math.random() * 10000).toFixed(0);
    this.setState({ anecdotes: this.state.anecdotes.concat(anecdote) });
    console.log('STATE ON ', this.state);
  };

  anecdoteById = id => this.state.anecdotes.find(a => a.id === id);

  vote = id => {
    const anecdote = this.anecdoteById(id);

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    };

    const anecdotes = this.state.anecdotes.map(a => (a.id === id ? voted : a));

    this.setState({ anecdotes });
  };

  notify = notification => {
    this.setState({
      notification
    });
    setTimeout(() => {
      this.setState({
        notification: ''
      });
    }, 100000);
  };

  render() {
    const notificationStyle = {
      color: 'green',
      fontStyle: 'italic',
      fontSize: 16,
      borderStyle: 'solid',
      borderRadius: 16,
      borderColor: 'green',
      borderWidth: 1,
      margin: 5,
      padding: 5
    };

    return (
      <Container>
        <div>
          <h1>Software anecdotes</h1>
          <Router>
            <div>
              <Menu />
              {this.state.notification === '' ? (
                <div />
              ) : (
                <div style={notificationStyle}>{this.state.notification}</div>
              )}
              <div>
                <Route exact path="/" render={() => <AnecdoteList anecdotes={this.state.anecdotes} />} />
                <Route path="/about" render={() => <About />} />
                <Route
                  path="/create"
                  render={({ history }) => <CreateNew history={history} notify={this.notify} addNew={this.addNew} />}
                />
                <Route
                  exact
                  path="/anecdote/:id"
                  render={({ match }) => <Anecdote anecdote={this.anecdoteById(match.params.id)} />}
                />
              </div>
            </div>
          </Router>
          <Footer />
        </div>
      </Container>
    );
  }
}

export default App;
