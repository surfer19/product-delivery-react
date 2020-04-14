import React  from 'react'
import logo from "../../img/lobelka.png";
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
						{/* <p>Milí naši zákazníci, mrzí nás situácia, že nemôžeme s Vami tráviť čas v našej reštaurácií. Avšak našli sme cestu ako Vám aj napriek tomu doručiť Vaše obľúbené jedlá. Využite možnosť objednávky online a vychutnajte si jedlo z pohodlí a bezpečia domova. Tešíme sa na Vaše objednávky. Váš Burina tím &lt;3 <br></br><br></br>Objednávku na daný deň je možné vytvoriť max. <strong>do 11:00</strong> daného dňa. Výdaj a rozvoz jedla bude od pondelka do piatku <strong>od 11:00 do 15:00</strong>. Parkovisko bude v tomto čase otvorené pre našich zákazníkov. V prípade dovozu jedna na adresu je možná len platba kartou.</p> */}
						<p>V Momente nakúpime, v Lobelke uvaríme a privezieme priamo k Vám. Kvalitný obed z poctivých surovín, uvarený s láskou. Priamo od šéfkuchára <strong>Romana Kováča</strong>, nášho Romča, chlapca, ktorý varil s hviezdami a dnes tu varí pre Vás. Overené našimi najmenšími a zároveň najväčšími gurmánmi. </p>
						<h3 style={{color: '#a9bf06'}}>Ako to funguje?</h3>
						<h4 style={{color: '#a9bf06'}}>1. My uvaríme, vy vyzdvihnete</h4>
						<p>V čase od <strong>10:00 - 11:00</strong> si pripravený obed vyzdvihnete osobne na adrese SNP 9, 031 01 Liptovský Mikuláš - Súkromná materská škola Lobelka.</p>
						<h4 style={{color: '#a9bf06'}}>2. My uvaríme a privezieme</h4>
						<p>Každý deň obed uvaríme, zabalíme a v čase od <strong>11:00</strong> privezieme priamo k Vám na Vami zadanú adresu.</p>
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
