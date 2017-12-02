import React, { Component } from 'react'
import queryString from 'query-string'
import './App.css'

class App extends Component {
  constructor() {
    super()

    const abi = [
      {
        constant: true,
        inputs: [{ name: '_gameId', type: 'uint256' }, { name: '_player', type: 'uint256' }],
        name: 'getPlayerMoves',
        outputs: [{ name: '', type: 'uint256[2][]' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      },
      {
        constant: false,
        inputs: [{ name: '_gameId', type: 'uint256' }, { name: '_moveCoordinates', type: 'uint256[2]' }],
        name: 'makeMove',
        outputs: [],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function'
      },
      {
        constant: true,
        inputs: [{ name: '_gameId', type: 'uint256' }],
        name: 'getCurrentPlayerId',
        outputs: [{ name: '', type: 'uint256' }],
        payable: false,
        stateMutability: 'view',
        type: 'function'
      }
    ]

    this.state = {
      contract: window.web3.eth.contract(abi).at('0x1dbaa21fc02f2bee946e92dcf707699cd7e91d30'),
      movesX: [],
      movesO: []
    }
  }

  componentWillMount() {
    this.fetchMoves()
  }

  componentDidMount() {
    setInterval(() => this.fetchMoves(), 5000)
  }

  fetchMoves() {
    this.fetchPlayerMoves(this.getGameId(), 0, (movesX) => this.setState({ movesX }))
    this.fetchPlayerMoves(this.getGameId(), 1, (movesO) => this.setState({ movesO }))
  }

  fetchPlayerMoves(gameId, playerId, cb) {
    return this.state.contract.getPlayerMoves(gameId, playerId, (err, result) => {
      if (err) {
        throw new Error(err)
      }

      cb(result.map(r => [r[0].c[0], r[1].c[0]]))
    })
  }

  getGameId() {
    return queryString.parse(window.location.search).game || 0
  }

  makeMove(coords) {
    this.state.contract.makeMove(this.getGameId(), coords, () => console.log('coords', coords))
  }

  renderCell(row, col) {
    const { movesX, movesO } = this.state
    let ch = ''

    if (movesX.find((coords) => coords[0] === row && coords[1] === col)) {
      ch = 'X'
    } else if (movesO.find((coords) => coords[0] === row && coords[1] === col)) {
      ch = 'O'
    }

    return <div className="cell" onClick={() => this.makeMove([row, col])}>{ch}</div>
  }

  render() {
    return (
      <div className="App">
        <div className="board">
          <div className="row">
            {this.renderCell(0, 0)}
            {this.renderCell(0, 1)}
            {this.renderCell(0, 2)}
          </div>
          <div className="row">
            {this.renderCell(1, 0)}
            {this.renderCell(1, 1)}
            {this.renderCell(1, 2)}
          </div>
          <div className="row">
            {this.renderCell(2, 0)}
            {this.renderCell(2, 1)}
            {this.renderCell(2, 2)}
          </div>
        </div>
      </div>
    )
  }
}

export default App
