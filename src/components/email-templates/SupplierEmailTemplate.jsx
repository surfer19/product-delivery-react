import React from "react";
import moment from 'moment';

export const SupplierEmailTemplate = ({basket, personalInfo, deliveryInfo, deliveryType, totalPrice, selectedCity}) => (
	<div>
		<p>Nová objednávka z dňa {moment().format("DD.MM.YYYY")}</p>
		Objednané:
		<ul>
			{
				basket.map(item => (
					<li>
						{`${item.ProductCategoryName} `}
						{/* {moment(item.ProductCategoryDate).format('DD.MM.YYYY') ` - `} */}
						{`${item.ProductCategoryDate} - `}
						{item.count}x  
						{` ${item.Price}`}€
						{` ${item.Name} - `}
						{item.Description ? ` ${item.Description}` : ''} 
						{item.DeliveryCity ? ` ${item.DeliveryCity} ` : ''}
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
			<li>E-mail: {personalInfo.Email}</li>
			<li>Tel.číslo: {personalInfo.Telephone}</li>
			<li>Poznámka: {personalInfo.Message}</li>
		</ul>
		
		{deliveryType === "NA_ADRESU" ? 
			<div>
				<p>Informácie o doručení: </p>
				<ul>
					<li>Adresa: {deliveryInfo.Address}</li>
					<li>Mesto: {selectedCity}</li>
				</ul>
			</div>
			: ""
		}
	</div>
);