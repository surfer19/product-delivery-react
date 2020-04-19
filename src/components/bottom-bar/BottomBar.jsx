import  React, { useContext } from 'react'
import { ContactContext } from "../../context";

export function BottomBar() {
	const [state, dispatch] = useContext(ContactContext);
	return (
		<div className="totalprice">
			<p className="totalprice-name">Cena celkom: </p>
			<p className="totalprice-price">{state.totalPrice ? state.totalPrice : 0} €</p>
		</div>
	)
}
