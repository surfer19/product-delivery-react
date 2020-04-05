import  React, { useContext } from 'react'
import { ContactContext } from "../../context";

export function BottomBar() {
	const [state, dispatch] = useContext(ContactContext);
	console.log('state', state)
	return (
		<div>
			<p>Cena celkom: {state.totalPrice ? state.totalPrice : 0} €</p>
			<button>POKRACOVAT</button>
		</div>
	)
}
