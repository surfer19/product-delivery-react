import React  from 'react'
import logo from "../../img/burina.png";
import cover from "../../img/cover.png";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";

export function Introduction() {
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					{/* <div className="cover" style={{backgroundImage: "url("+cover+")"}}></div> */}
					<div className="wrapper" style={{position: 'relative'}}>
						<div className="roundedlogo" style={{backgroundImage: "url("+logo+")"}}></div>
						<h2>{state.supplier.Name}</h2>
						<p className="subtitle">{state.supplier.type}</p>
						{/* <p>{state.supplier.info}</p> */}
						<p>Využite možnosť objednávky online a vychutnajte si jedlo z pohodlia a bezpečia domova. Tešíme sa na Vaše objednávky. Váš Burina tím &lt;3 <br></br><br></br>Objednávku je možné vytvoriť <strong>do 10:30 hod.</strong> aktuálneho dňa. Vyzdvihnutie a rozvoz jedla bude od pondelka do piatku <strong>od 11:00 do 15:00</strong>.</p>
						<small style={{marginTop: '20px', lineHeight: 1.3, display: 'block', color: 'grey', fontSize: '10px'}}>Rezervačný systém bol vyvorený ako podpora <br/> pre podnikateľov v dobe korona-krízy.<br/> <a style={{textDecoration: 'underline', color: 'grey'}} href="mailto:productdelivery@gorazd.sk">Kontaktný e-mail na tvorcu</a></small>

						<div className="footer">
							<Link to="/supplier-offer" className="button button-full">
								<span>
								Spustiť objednávku
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
