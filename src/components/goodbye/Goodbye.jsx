import React from 'react';
import { Link } from "react-router-dom";

export function Goodbye() {
	return (
		<div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column',height: '100vh'}}>
			<h3>Už sa na tom pracuje!</h3>
			<p>Ďakujeme za objednávku :)<br></br>
			 V prípade akýchkoľvek zmien nás kontaktujte na tel. čísle: <strong>+421 915 910 592</strong>
			 <br></br>Vaša burina
			 {/* <br></br>Vaša MŠ Lobelka */}
			</p>
			<Link to="/" className="button">Vrátiť sa na homepage</Link>			
		</div>
	)
}
