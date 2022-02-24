import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './Home'
import './style.css'

const App = () => {
    return (
		<Switch>
			<Route
				path='/'
				exact={true}
				render={() => <Home />}
			/>
		</Switch>
	)
}

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
	document.getElementById('root')
)