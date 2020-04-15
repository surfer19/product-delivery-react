import React from "react";
import moment from 'moment';

export const CustomerEmailTemplate = ({basket, personalInfo, supplierInfo, deliveryInfo, deliveryType, totalPrice, selectedCity}) => (
	<div>
		<h3>Ďakujeme za Vašu objednávku z dňa {moment().format("DD.MM.YYYY HH:MM")}.</h3>

		<p>Objednali ste si:</p>
		<ul>
			{basket.map(item => (
				<li>
					{item.ProductCategoryName ? `${item.ProductCategoryName}` : ''}
					{item.ProductCategoryDate ? ` (${moment(item.ProductCategoryDate).format("DD.MM.YYYY")})` : ''}		
					{/* {` - ${item.count}`}x   */}
					{item.DeliveryCity ? ` ${item.count}x` : ` - ${item.count}x`}
					{` ${item.Price}`}€
					{` ${item.Name} - `}
					{item.Description ? ` ${item.Description} ` : ''}
					{item.DeliveryCity ? ` (${item.DeliveryCity}) ` : ''}
				</li>
			))}
		</ul>
		
		<p><strong>Cena spolu: {totalPrice} €</strong></p>

		<p>Kontaktné informácie: </p>
		<ul>
			<li>Meno: {personalInfo.Name}</li>
			<li>Priezvisko: {personalInfo.LastName}</li>
			<li>E-mail: {personalInfo.Email}</li>
			<li>Tel.číslo: {personalInfo.Telephone}</li>
			<li>Poznámka: {personalInfo.Message}</li>
		</ul>

		{deliveryType === "NA_PREDAJNI"
			? (<>
				<p>Forma doručenia: <span>Vyzdvihnutie na pobočke</span></p>
				<p>Vašu objednávku si môžete vyzdvihnúť u nás v MŠ Lobelka od 
					{/* <strong> {supplierInfo.OpeningHoursFrom}</strong> do 
					<strong> {supplierInfo.OpeningHoursTo}</strong>. */}
					<strong> 10:00</strong> do 
					<strong> 11:00</strong>.
				</p>
				<p>
					V prípade, že chcete niečo zmeniť vo Vašej objednávke kontaktujte nás 
					<strong> {supplierInfo.PhoneNumber}</strong>
				</p>
				</>
			)
			: (<>
				<p>Forma doručenia: <strong>Doručenie na adresu</strong></p>
				<p>	Vaše objednávka bude doručená na: </p>
				<ul>
					<li>Adresa: {deliveryInfo.Address}</li>
					<li>Mesto: {selectedCity}</li>
				</ul>
				{/* <p>Cena rozvozu je [XX]€</p> */}
				<p>
					V prípade, že chcete niečo zmeniť vo Vašej objednávke kontaktujte nás
					<strong> {supplierInfo.PhoneNumber}</strong>
				</p>		
				</>
			)}

		<p>{supplierInfo.Name}</p>
	</div>
);