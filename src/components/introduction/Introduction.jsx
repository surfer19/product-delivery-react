import React  from 'react'
import logo from "../../img/lobelka.png";
import cover from "../../img/cover.png";
import { GlobalContext } from "../loading-wrapper/LoadingWrapper";
import { Link, useRouteMatch } from "react-router-dom";
import { Markup } from 'interweave';

export function Introduction() {
	let { url } = useRouteMatch();
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					{/* <div className="cover" style={{backgroundImage: "url("+cover+")"}}></div> */}
					<div className="wrapper" style={{position: 'relative'}}>
						<div className="roundedlogo" style={{backgroundImage: "url("+logo+")"}}></div>
						<h2 style={{color: state.supplier.HighlightColor}}>{state.supplier.Name}</h2>
						<p className="subtitle">{state.supplier.type}</p>
						<>
							<Markup content={state.supplier.description} />
						</>

						{state.supplier.FirstTitle 
							? (
								<>
									<h3 style={{color: state.supplier.HighlightColor}}>
										Ako to funguje?
									</h3>

									<h4 style={{color: state.supplier.HighlightColor}}>
										<Markup content={state.supplier.FirstTitle} />
									</h4>
									<span>
										<Markup content={state.supplier.FirstTitleDescription} />
									</span>
									<h4 style={{color: state.supplier.HighlightColor}}>
										<Markup content={state.supplier.SecondTitle} />
									</h4>
									<>
										<Markup content={state.supplier.SecondTitle} />
									</>
								</>
							)
							: null
						}
						{/* static */}
						<small style={{marginTop: '20px', lineHeight: 1.3, display: 'block', color: 'grey', fontSize: '10px'}}>Rezervačný systém bol vyvorený ako podpora <br/> pre podnikateľov v dobe korona-krízy.<br/> <a style={{textDecoration: 'underline', color: 'grey'}} href="mailto:productdelivery@gorazd.sk">Kontaktný e-mail na tvorcu</a></small>

						<div className="footer">
							<Link to={`${url}/supplier-offer`} className="button button-full">
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
