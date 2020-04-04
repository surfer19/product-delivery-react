import React, { Component } from 'react'
import logo from "../../img/logo.jpeg";

export class Introduction extends Component {
	render() {
		return (
			<>
				<h3>Restauracia Burina</h3>
				<p>Nejake info o restike</p>
				<img src={logo} alt=""/>
			</>
		)
	}
}

export default Introduction
