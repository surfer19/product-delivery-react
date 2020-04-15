import React from "react";
import moment from 'moment';

export const CustomerEmailTemplate = ({basket, personalInfo, supplierInfo, deliveryInfo, deliveryType, totalPrice}) => (
	<div>
		<h3>Ďakujeme za Vašu objednávku z dňa {moment().format("DD.MM.YYYY HH:MM")}.</h3>

		<p>Objednali ste si:</p>
		<ul>
			{basket.map(item => (
				<li>
					{`${item.CategoryName} - `}
					{item.count}x  
					{` ${item.Name} - `}
					{item.Description ? ` ${item.Description} ` : ''}
					cena: {item.Price} €
				</li>
			))}
		</ul>
		
		<p>Cena spolu: {totalPrice} €</p>

		{deliveryType === "NA_PREDAJNI"
			? (<>
				<p>Forma doručenia: <span>Vyzdvihnutie na pobočke</span></p>
				<p>Vašu objednávku si môžete vyzdvihnúť u nás v MS Lobelka od 
					<strong> {supplierInfo.OpeningHoursFrom}</strong> do 
					<strong> {supplierInfo.OpeningHoursTo}</strong>.
				</p>
				<p>
					V prípade, že chcete niečo zmeniť vo Vašej objednávke kontaktujte 
					<strong> {supplierInfo.PhoneNumber}</strong>
				</p>
				</>
			)
			: (<>
				<p>Forma doručenia: <span>Doručenie na adresu</span></p>
				<p>	Vaše objednávka bude doručená na: {deliveryInfo.Address}, {deliveryInfo.City}, {deliveryInfo.PostCode}</p>
				{/* <p>Cena rozvozu je [XX]€</p> */}
				<p>
					V prípade, že chcete niečo zmeniť vo Vašej objednávke kontaktujte 
					<strong> {supplierInfo.PhoneNumber}</strong>
				</p>		
				</>
			)}

		<p>{supplierInfo.Name}</p>
	</div>
);