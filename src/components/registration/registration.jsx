import React from 'react';
import {Button, FormControl, Form, Container} from 'react-bootstrap';
import { useFormInput } from '../admin/Admin';
import { RegistrationTemplate } from '../email-templates/RegistrationTemplate';
import ReactDOMServer from 'react-dom/server';
import example from '../../img/example.png';
import { showNotification } from '../notification/notification'

export function Registration() {
	const supplierName = useFormInput("");
	const supplierType = useFormInput("");
	const supplierPhone = useFormInput("");
	const supplierEmail = useFormInput("");
	const generalDescription = useFormInput("");
	const firstTitle = useFormInput("");
	const firstDescription = useFormInput("");
	const secondTitle = useFormInput("");
	const secondDescription = useFormInput("");
	const productNote = useFormInput("");
	const deliveryCityList = useFormInput("");
	const pickupTime = useFormInput("");
	
	const registrationParams = {
		supplierName: supplierName.value,
		supplierType: supplierType.value,
		supplierPhone: supplierPhone.value,
		supplierEmail: supplierEmail.value,
		generalDescription: generalDescription.value,
		firstTitle: firstTitle.value,
		firstDescription: firstDescription.value,
		secondTitle: secondTitle.value,
		secondDescription: secondDescription.value,
		productNote: productNote.value,
		deliveryCityList: deliveryCityList.value,
		pickupTime: pickupTime.value,
	}

	return (
		<Container>
			<h1 className="mt-5">Registrácia prevádzky</h1>
			<p>Pre vytvorenie reštuarácie potrebujeme informácie o Vašej prevádzke ktoré budeme zobrazovať klientom na úvodnej stránke 
				alebo v ďalších častiach aplikácie.
				Pre inšpiráciu to môže po registrácii vyzerať napríklad takto:
			</p>
			<img src={example} width="70%" alt="Priklad"/>
			<Form onSubmit={(event) => onRegistrationSubmit(
					event,
					registrationParams,
				)}
				className="my-3"
			>
				<Form.Group controlId="formBasicEmail" className="text-left">
					<Form.Label className="mt-3">Meno prevádzky*</Form.Label>
					<Form.Control type="text" placeholder="...Ufo" {...supplierName}/>

					<Form.Label className="mt-3">Typ prevádzky*</Form.Label>
					<Form.Control type="text" placeholder="...Reštaurácia s vyhliadkou" {...supplierType}/>

					<Form.Label className="mt-3">Popis prevádzky*</Form.Label>
					<FormControl as="textarea" rows="5" placeholder="...Reštaurácia je otvorená od roku 2005, keď prešli jej pôvodné priestory rozsiahlou rekonštrukciou. Interiér je minimalistický, funkčne navrhnutý pre dokonalý zážitok z výhľadu a skvelej gastronómie. UFO má už od svojho otvorenia svoje výsostné postavenie medzi prestížnymi bratislavskými reštauráciami." {...generalDescription}/>

					<Form.Label className="mt-3">Prvy titulok</Form.Label>
					<Form.Control type="text" placeholder="...1. My uvaríme, vy vyzdvihnete" {...firstTitle}/>

					<Form.Label className="mt-3">Prvy popis</Form.Label>
					<FormControl as="textarea" placeholder="...V čase od 11:00 - 12:00 si pripravený obed vyzdvihnete osobne na adrese Juliana 12 Bratislava." {...firstDescription}/>

					<Form.Label className="mt-3">Druhy titulok</Form.Label>
					<Form.Control type="text" placeholder="...2. My uvaríme a privezieme" {...secondTitle}/>

					<Form.Label className="mt-3">Druhy popis</Form.Label>
					<FormControl as="textarea" rows="3" placeholder="...Každý deň obed uvaríme, zabalíme a v čase od 11:00 privezieme priamo k Vám na Vami zadanú adresu." {...secondDescription}/>

					<Form.Label className="mt-3">Poznámka pod výberom produktov (zoznam alergénov a pod.)</Form.Label>
					<Form.Control type="text" placeholder="...1 - obilniny obsahujúce lepok; 2 - kôrovce a výrobky z nich; 3 - vajcia a výrobky z vajec;" {...productNote}/>

					<Form.Label className="mt-3">Zoznam miest a cien za dopravu (v prípade že doručujete)</Form.Label>
					<FormControl as="textarea" placeholder="...Sielnica - 2€, Ruzomberok 2€" {...deliveryCityList}/>

					<Form.Label className="mt-3">Cas vyzdvihnutia na predajni</Form.Label>
					<Form.Control type="text" placeholder="...od 12:00 do 14:00" {...pickupTime}/>

					<Form.Label className="mt-3">Telefonne cislo prevadzky*</Form.Label>
					<Form.Control type="text" placeholder="...0908 932 432" {...supplierPhone}/>

					<Form.Label className="mt-3">Email prevadzky pre objednavky*</Form.Label>
					<Form.Control type="text" placeholder="...objednavky@ufo.sk" {...supplierEmail}/>

					<Form.Control type="hidden" />
				</Form.Group>

				<Button variant="primary" type="submit">
					Zaregistrovať prevádzku
				</Button>
			</Form>
		</Container>
	)
}

const onRegistrationSubmit = async (event, registrationParams, ref) => {
	event.preventDefault();
	console.log('registrationParams', registrationParams);
	const dataRegistration = {
		to: 'marianmrva123@gmail.com',
		header: `Vytvorenie novej prevádzky ${registrationParams.supplierName}`,
		body: ReactDOMServer.renderToStaticMarkup(
			<RegistrationTemplate registrationData={registrationParams}/>
		),
	}
	const registrationOptions = {
		method: 'POST',
		body: JSON.stringify(dataRegistration),
	}
	const resRegistrationEmail = await fetch('https://fecko.org/productdelivery/custom/create-mail', registrationOptions);
	const jsonRegistrationEmail = await resRegistrationEmail.json();
	scrollTop()
	showNotification('topRight', 'Ďakujeme za registráciu! Čoskoro vás kontaktujeme! Váš Zjedzme team.', null,7)
	console.log('jsonRegistrationEmail', jsonRegistrationEmail)
}
function scrollTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}