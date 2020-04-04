import React from 'react'
import { Link } from "react-router-dom";

export function CustomerForm() {
	return (
		<div>
			<Link to="/goodbye">
				<button>
					Potvrdit Udaje
				</button>
			</Link>
		</div>
	)
}
