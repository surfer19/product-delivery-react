import React from 'react'
import { Link } from "react-router-dom";

export function OfferList() {
	return (
		<div>
			<p>VYBER Z PONUKY</p>
			<button>
				<Link to="/customer-form">vase udaje</Link>
			</button>
		</div>
	)
}