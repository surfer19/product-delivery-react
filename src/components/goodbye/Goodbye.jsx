import React from 'react';
import { Link, useParams} from "react-router-dom";
import { GlobalContext } from "../loading-wrapper/LoadingWrapper";

export function Goodbye() {
	let { supplierIdName } = useParams();
	return (
		<GlobalContext.Consumer>
			{globalState => (
				<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column',height: '100vh', padding: '0 10px'}}>
					<h3 style={{color: '#a9bf06'}}>Už sa na tom pracuje!</h3>
					<p>Ďakujeme za objednávku :)<br></br>
					V prípade akýchkoľvek zmien nás kontaktujte na tel. čísle: <strong>{globalState.supplier.phone}</strong>
					{/* <br></br>Vaša burina */}
					<br></br>{globalState.supplier.greeting}
					</p>
					<Link to={`/${supplierIdName}`} className="button">Vrátiť sa na homepage</Link>			
				</div>
			)}
		</GlobalContext.Consumer>
	)
}
