import React  from 'react'
import logo from "../../img/logo.jpeg";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";

export function Introduction() {
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					<img src={logo} alt=""/>
					<h2>{state.supplier.Name}</h2>
					<h4>{state.supplier.type}</h4>
					<p>{state.supplier.info}</p>
					<Link to="/supplier-offer">
						<button>
						spustiť objednávku
						</button>
					</Link>
				</>
			)}
		</GlobalContext.Consumer>
	)
}

export default Introduction
