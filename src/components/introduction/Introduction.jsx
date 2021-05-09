import React  from 'react'
import logo from "../../img/logo-orange.png";
// import cover from "../../img/cover.png";
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
						{/* <p>Milí naši zákazníci, mrzí nás situácia, že nemôžeme s Vami tráviť čas v našej reštaurácií. Avšak našli sme cestu ako Vám aj napriek tomu doručiť Vaše obľúbené jedlá. Využite možnosť objednávky online a vychutnajte si jedlo z pohodlí a bezpečia domova. Tešíme sa na Vaše objednávky. Váš Burina tím &lt;3 <br></br><br></br>Objednávku na daný deň je možné vytvoriť max. <strong>do 11:00</strong> daného dňa. Výdaj a rozvoz jedla bude od pondelka do piatku <strong>od 11:00 do 15:00</strong>. Parkovisko bude v tomto čase otvorené pre našich zákazníkov. V prípade dovozu jedna na adresu je možná len platba kartou.</p> */}
						<p>Víkend by mal začať pokojným ránom v pohodlí domova. S Raňajkobraním sa o to Vaše postaráme každú sobotu. Pripravíme Vám raňajky z poctivých potravín a prinesieme ich až k Vaším dverám. Stačí len pár klikov a čerstvé a chutné raňajky bez námahy môžu byť aj Vašou realitou. S Momentom je to naozaj také jednoduché.</p>
						<h3>Ako to funguje?</h3>
						{/* <h4 style={{color: '#a9bf06'}}>1. My uvaríme, vy vyzdvihnete</h4>
						<p>V čase od <strong>11:00 - 12:00</strong> si pripravený obed vyzdvihnete osobne na adrese SNP 9, 031 01 Liptovský Mikuláš - Súkromná materská škola Lobelka.</p>
						<h4 style={{color: '#a9bf06'}}>2. My uvaríme a privezieme</h4> */}
						<p><strong>Do piatku 18:00</strong> si objednáte raňajkový box a my Vám ho prinesieme priamo domov. Donáška až ku Vaším dverám príde v sobotu medzi <strong>7:00-10:00</strong>.</p>
						{/* <small style={{marginTop: '20px', lineHeight: 1.3, display: 'block', color: 'grey', fontSize: '10px'}}>Rezervačný systém bol vyvorený ako podpora <br/> pre podnikateľov v dobe korona-krízy.<br/> <a style={{textDecoration: 'underline', color: 'grey'}} href="mailto:productdelivery@gorazd.sk">Kontaktný e-mail na tvorcu</a></small> */}

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
