import React  from 'react'
import logo from "../../img/logo.jpeg";
import { MyContext } from "../../App";
import { Link } from "react-router-dom";

export function Introduction() {
	return (
		<MyContext.Consumer>
			{state => (
				<>
					<img src={logo} alt=""/>
					<h2>{state.supplier.Name}</h2>
					<h4>{state.supplier.type}</h4>
					<p>{state.supplier.info}</p>
					<button>
						<Link to="/supplier-offer">spustiť objednávku</Link>
					</button>
				</>
			)}
		</MyContext.Consumer>
	)
}

export default Introduction
