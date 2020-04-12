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
						{/* <p>{state.supplier.info}</p> */}
						<p>Milí naši zákazníci, mrzí nás situácia, že nemôžeme s Vami tráviť čas v našej reštaurácií. Avšak našli sme cestu ako Vám aj napriek tomu doručiť Vaše obľúbené jedlá. Využite možnosť objednávky online a vychutnajte si jedlo z pohodlí a bezpečia domova. Tešíme sa na Vaše objednávky. Váš Burina tím &lt;3 <br></br><br></br>Objednávku na daný deň je možné vytvoriť max. <strong>do 11:00</strong> daného dňa. Výdaj a rozvoz jedla bude od pondelka do piatku <strong>od 11:00 do 15:00</strong>. Parkovisko bude v tomto čase otvorené pre našich zákazníkov. V prípade dovozu jedna na adresu je možná len platba kartou.</p>
						<div class="footer">
							<Link to="/supplier-offer" class="button button-full">
								<span>
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
