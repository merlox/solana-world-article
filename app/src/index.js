import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './styles.styl'

var mountNode = document.getElementById('root')
ReactDOM.render(<App name='Jane' />, mountNode)
