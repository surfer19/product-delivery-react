import React  from 'react'
import logo from "../../img/logo.jpeg";
import cover from "../../img/cover.png";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";

export function Introduction() {
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					<div class="cover" style={{backgroundImage: "url("+cover+")"}}></div>
					
					
					<div class="wrapper" style={{position: 'relative'}}>
						<div class="roundedlogo" style={{backgroundImage: "url("+logo+")"}}></div>
						<h2>{state.supplier.Name}</h2>
						<p class="subtitle">{state.supplier.type}</p>
						<p>{state.supplier.info}</p>
						<div class="footer">
							<Link to="/supplier-offer">
								<span class="button button-full">
								spustiť objednávku
								</span>
							</Link>
						</div>
					</div>
				</>
			)}
		</GlobalContext.Consumer>
	)
}

export default Introduction
