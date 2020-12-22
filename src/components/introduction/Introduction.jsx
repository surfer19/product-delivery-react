import React  from 'react'
import logo from "../../img/logo-orange.png";
import bgImg from "../../img/bg.png";
import { GlobalContext } from "../../App";
import { Link } from "react-router-dom";

export function Introduction() {
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					{/* <div className="cover" style={{backgroundImage: "url("+cover+")"}}></div> */}
					<div className="wrapper" style={{position: 'relative', backgroundImage: "url("+bgImg+")"}}>
						<div className="roundedlogo" style={{backgroundImage: "url("+logo+")"}}></div>
						<h2>{state.supplier.Name}</h2>
						<p className="subtitle">{state.supplier.type}</p>
						{/* <p>{state.supplier.info}</p> */}
						{/* <p>Milí naši zákazníci, mrzí nás situácia, že nemôžeme s Vami tráviť čas v našej reštaurácií. Avšak našli sme cestu ako Vám aj napriek tomu doručiť Vaše obľúbené jedlá. Využite možnosť objednávky online a vychutnajte si jedlo z pohodlí a bezpečia domova. Tešíme sa na Vaše objednávky. Váš Burina tím &lt;3 <br></br><br></br>Objednávku na daný deň je možné vytvoriť max. <strong>do 11:00</strong> daného dňa. Výdaj a rozvoz jedla bude od pondelka do piatku <strong>od 11:00 do 15:00</strong>. Parkovisko bude v tomto čase otvorené pre našich zákazníkov. V prípade dovozu jedna na adresu je možná len platba kartou.</p> */}
						<p>Remeselná pekáreň uprostred Liptova. Miesto, kde sa spája tradícia, srdce a vášeň. Sila prírody, ruky človeka a čas ju robia výnimočnou. Dobrý chlieb je výsledkom poctivej práce pekára Aleša, ktorý žije svoj sen. Kváskový chlieb, poctivé potraviny pod jednou strechou. To je Moment. </p>
						<h3 style={{marginBottom: '15px'}}>Ako to funguje?</h3>
						{/* <h4>1. Chlieb</h4> */}
						{/* <p>V čase do <strong>09:00 hod.</strong> si chlieb objednáte a počká na vás v Momente.  Kedykoľvek počas otváracích hodín si ho môžete vyzdvihnúť. Ak nemáte cestu radi vám ho privezieme na Vami zadanú adresu.</p> */}
						<p>V čase do <strong>09:00 hod.</strong> si chlieb objednáte a počká na vás v Momente.  Kedykoľvek počas otváracích hodín si ho môžete vyzdvihnúť.</p>
						{/* <h4>2. Poctivé potraviny</h4> */}
						{/* <p>V čase do <strong>09:00 hod.</strong> vám k chlebu pribalíme čokoľvek nachádzajúce sa v našich regáloch. Napíšete svoj nákupný zoznam <strong>do poznámky v druhom kroku objednávky</strong>, my ho nachystáme a zabalíme. Kedykoľvek počas otváracích hodín si ho môžete vyzdvihnúť alebo vám ho taktiež privezieme. </p> */}
						<p><strong>Viac info na: +421 948 033 354; potraviny@vmomente.sk</strong></p>
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
