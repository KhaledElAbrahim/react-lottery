import React, { Component } from 'react';
import './App.css';
import web3 from './web3';
import lottery from './lottery.js';

class App extends Component {

  state = {
    manager: '',
    players:[],
    balance:'',
    value:'',
    message:''
  };

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await lottery.methods.getBalance(lottery.options.address).call();

    this.setState({manager, players, balance});
  }
  
  onSubmit = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({message: 'Please wait as your transaction is processed'});

    await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});
    this.setState({message: 'You are in the running to win. GOOD LUCK'});
  };

  whoWins = async () => {
    const accounts = await web3.eth.getAccounts();
    
    this.setState({message: 'Just a moment.'})

    await lottery.methods.pickWinner().send({from: accounts[0]});
    this.setState({message: 'The chosen one lives.'});
  };

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>The lottery contract is managed by {this.state.manager}</p>
        <p>There are currently {this.state.players.length} people entered,
          competing to win {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        
        <form onSubmit={this.onSubmit}>
          <h4>Please the lottery win money.</h4>
          <div>
            <label>Amount of ether to enter</label>
            <input 
            value={this.state.value}
            onChange = {event => this.setState({value: event.target.value})}/>
          </div>
          <button>Enter</button>
        </form>
        <hr />
        <h4>Time for draw lottery?</h4>
        <button onClick={this.whoWins}>Find Winner</button>
        <hr />
        <div><h2>{this.state.message}</h2></div>
      </div>
    );
  }
}

export default App;
