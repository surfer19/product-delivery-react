import React from 'react';
import { Link } from "react-router-dom";

export function Goodbye() {
	return (
		<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column',height: '100vh'}}>
			<h3 style={{color: '#a9bf06'}}>Ďakujeme za objednávku :)</h3>
			<p>V prípade akýchkoľvek zmien nás kontaktujte na tel. čísle: <strong>+421 948 033 354</strong>
			 {/* <br></br>Vaša burina */}
			 <br></br>Váš moment
			</p>
			<Link to="/" className="button">Vrátiť sa na homepage</Link>			
		</div>
	)
}
