import React  from 'react'
import logo from "../../img/logo.jpeg";
import { MyContext } from "../../App";

export function Introduction() {
	return (
		<MyContext.Consumer>
			{state => (
				<>
					<h2>{state.supplier.Name}</h2>
					<h3>{state.supplier.type}</h3>
					<p>{state.supplier.info}</p>
					<img src={logo} alt=""/>
				</>
			)}
		</MyContext.Consumer>
	)
}

export default Introduction
