import React from "react";
import moment from 'moment';

export const SupplierEmailTemplate = ({basket, personalInfo, deliveryInfo, deliveryType, totalPrice}) => (
	<div>
		<p>Nová objednávka z dňa {moment().format("DD.MM.YYYY")}</p>
		Objednané:
		<ul>
			{
				basket.map(item => (
					<li>
						{item.count}x  
						{` ${item.Price}`}€
						{` ${item.Name} - `}
						{item.Description ? ` ${item.Description}` : ''} 
					</li>
				))
			}
			<li>Cena celkom: {totalPrice}€</li>
		</ul>
		<p>Typ doručenia: 
			{deliveryType === "NA_PREDAJNI" ? " Vyzdvihnutie na predajni" : " Doručenie na adresu" }
		</p>
		<p>Informácie o zákazníkovi: </p>
		<ul>
			<li>Meno: {personalInfo.Name}</li>
			<li>Priezvisko: {personalInfo.LastName}</li>
			<li>Email: {personalInfo.Email}</li>
			<li>Tel.cislo: {personalInfo.Telephone}</li>
			<li>Poznamka: {personalInfo.Message}</li>
		</ul>
		
		{deliveryType === "NA_ADRESU" ? 
			<div>
				<p>Informácie o doručení: </p>
				<ul>
					<li>Adresa: {deliveryInfo.Address}</li>
					<li>Mesto: {deliveryInfo.City}</li>
					<li>PSC: {deliveryInfo.PostCode}</li>
				</ul>
			</div>
			: ""
		}
	</div>
);