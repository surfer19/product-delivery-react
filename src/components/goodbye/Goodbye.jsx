import React from 'react';
import { Link } from "react-router-dom";

export function Goodbye() {
	return (
		<div>
			Thanks for your order Goodbye!
			<Link to="/">home</Link>			
		</div>
	)
}
