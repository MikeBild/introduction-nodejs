import '@babel/polyfill';

import React, { Fragment as F, Component, createRef } from 'react';
import { render } from 'react-dom';

class App extends Component {
  state = {
    todos: [],
  };

  async componentDidMount() {
    await this.refetch();
  }

  async refetch() {
    const response = await fetch('http://localhost:8080/api/todos');
    const todos = await response.json();
    this.setState({ todos });
  }

  render() {
    const descInput = createRef();
    const addTodo = async () => {
      const response = await fetch('http://localhost:8080/api/todos', {
        method: 'POST',
        body: JSON.stringify({ description: descInput.current.value }),
        headers: { 'Content-Type': 'application/json' },
      });
      const newTodo = await response.json();
      this.setState({ todos: this.state.todos.concat([newTodo]) });
    };

    return (
      <F>
        <h1>Todo-App</h1>
        <div>
          <input type="text" ref={descInput} />
          <button onClick={() => addTodo()}>Add</button>
        </div>
        <button onClick={() => this.refetch()}>Refresh</button>
        <ul>
          {this.state.todos.map(x => {
            return <li key={x.id}>{x.description}</li>;
          })}
        </ul>
      </F>
    );
  }
}

render(<App />, document.getElementById('root'));
