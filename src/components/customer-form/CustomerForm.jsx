import React, { useState, useContext, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";
import { SupplierEmailTemplate } from "../email-templates/SupplierEmailTemplate";

export function CustomerForm(props) {
	console.log('props', props)
	const [state, dispatch] = useContext(ContactContext);
	const [isActiveDeliveryShop, setActiveDeliveryShop] = useState(true)
	const [isActiveDeliveryAddress, setActiveDeliveryAddress] = useState(false)
	const name = useFormInput("");
	const lastName = useFormInput("");
	const email = useFormInput("");
	const tel = useFormInput("");
	const message = useFormInput("");
	const formRef = useRef(null);
	const postCode = useFormInput("");
	const city = useFormInput("");
	const address = useFormInput("");
	console.log('state', state)
	
	async function onSubmitDeliveryTypeChange (deliveryType) {
		dispatch({
			type: "UPDATE_DELIVERY",
			payload: deliveryType
		});
	}

	const removeItemfromBasket = id => {
		dispatch({
			type: "REMOVE_FROM_BASKET",
		    payload: id
		});
	}

	const addItemToBasket = item => {
		dispatch({
			type: "ADD_TO_BASKET",
		    payload: item
		});
	  };

	const recalculateTotalPrice = () => {
		dispatch({
			type: "RECALCULATE_TOTAL_PRICE",
		});
	}

	async function onSubmit() {
		let formDataCustomer = new FormData();
		formDataCustomer.append('Name', name.value);
		formDataCustomer.append('LastName', lastName.value);

		const optionPost = {
			method: 'POST',
			body: formDataCustomer
		}
		// vytvoerenie noveho customera
		const resCustomer = await fetch('https://fecko.org/productdelivery/Customer/create', optionPost);
		const jsonCustomer = await resCustomer.json();

		let formDataAddress = new FormData();
		formDataAddress.append('CustomerID', jsonCustomer.record.CustomerID);
		formDataAddress.append('City', city.value);
		formDataAddress.append('Address', address.value);
		formDataAddress.append('PostCode', postCode.value);
		formDataAddress.append('Email', email.value);
		formDataAddress.append('PhoneNo', tel.value);
		formDataAddress.append('SupplierID', '1');
		// vytvorenie adresy customera
		const resCustomerAddress = await fetch('https://fecko.org/productdelivery/Address/create', {
			method: 'POST',
			body: formDataAddress,
		});
		const jsonCustomerAddress = await resCustomerAddress.json();
		console.log('jsonCustomerAddress', jsonCustomerAddress)
		console.log('')
		// vytvoerenie novej objednavky
		let formData = new FormData();
		formData.append('CustomerID', jsonCustomer.record.CustomerID);
		formData.append('SupplierID', '1');
		const options = {
			method: 'POST',
			body: formData,
		}
		const resOrder = await fetch('https://fecko.org/productdelivery/Order/create', options);
		const jsonOrder = await resOrder.json();
		console.log('jsonOrder', jsonOrder)
		dispatch({
			type: "SEND_PERSONAL_FORM",
			payload: { 
				id: 1,
				name: name.value,
				lastName: lastName.value,
				email: email.value,
				tel: tel.value,
				message: message.value,
			}
		});

		// map cez basket passovat orderID a productID
		const createdConnections = state.basket.map(async item => {
			let formData = new FormData();
			formData.append('OrderID', jsonOrder.record.OrderID);
			formData.append('ProductID', item.ProductID);

			let optionsOrdersProducts = {
				method: 'POST',
				body: formData,
			}
			return await fetch('https://fecko.org/productdelivery/OrdersProducts/create', optionsOrdersProducts)
		})
		// console.log('buildEmailHtmlString', buildEmailHtmlString())
		const personalInfo = {
			Name: name.value || "Nevyplnené",
			LastName: lastName.value || "Nevyplnené",
			Email: email.value || "Nevyplnené",
			Telephone: tel.value || "Nevyplnené",
			Message: message.value || "Nevyplnené",
		}
		const deliveryInfo = {
			Address: address.value || "Nevyplnené",
			City: city.value || "Nevyplnené",
			PostCode: postCode.value || "Nevyplnené",
		}
		// vytvorit email
		const data = {
			to: "marianmrva123@gmail.com",
			header: "subject test",
			body: ReactDOMServer.renderToStaticMarkup(
				<SupplierEmailTemplate
					basket={state.basket}
					personalInfo={personalInfo}
					deliveryInfo={deliveryInfo}
					deliveryType={state.deliveryType}
					totalPrice={state.totalPrice}
				/>
			),
		}
		console.log('data', data)
		const formDataSendEmailOption = {
			method: 'POST',
			body: JSON.stringify(data),
		}
		const resEmail = await fetch('https://fecko.org/productdelivery/custom/create-mail', formDataSendEmailOption);
		const jsonEmail = await resEmail.json();
		console.log('jsonEmail', jsonEmail)
	}

	return (
		<div className="wrapper">
			<ul className="shopheader">
				<li className="active">
					<span className="shopheader-num">1</span>
					<span className="shopheader-title">Výber <br></br>z ponuky</span>
				</li>
				<li className="active">
					<span className="shopheader-num">2</span>
					<span className="shopheader-title">Vaše <br></br>údaje</span>
				</li>
				<li>
					<span className="shopheader-num">3</span>
					<span className="shopheader-title">To je <br></br>všetko :)</span>
				</li>
			</ul>

			<p className="catname">Doručenie objednávky</p>
			<div className="choosedeliverybtn-group">
				<button className={state.deliveryType === "NA_PREDAJNI" ? "choosedeliverybtn active" : "choosedeliverybtn"} onClick={() => {
						const foundDelivery = state.basket.filter(basketItem => basketItem.Name === "Doručenie na adresu")
						if (foundDelivery){
							removeItemfromBasket(foundDelivery.ProductID)
							recalculateTotalPrice()
						}
						onSubmitDeliveryTypeChange("NA_PREDAJNI");
						if (isActiveDeliveryShop) {
							setActiveDeliveryAddress(false);
							setActiveDeliveryShop(false);
							return;
						};
						setActiveDeliveryShop(true);
						setActiveDeliveryAddress(false);
					}}>
					<p className="choosedeliverybtn-title">Vyzvihnem <br></br>u nás</p>
					<span className="choosedeliverybtn-subtitle">od 11:00 do 15:00</span>
				</button>
				<button className={state.deliveryType === "NA_ADRESU" ? "choosedeliverybtn active" : "choosedeliverybtn"} onClick={() => {
						const foundDelivery = state.basket.filter(basketItem => basketItem.Name === "Doručenie na adresu")
						onSubmitDeliveryTypeChange("NA_ADRESU");
						// remove
						if (isActiveDeliveryAddress) {
							setActiveDeliveryAddress(false);
							setActiveDeliveryShop(false);
							if (foundDelivery)
								removeItemfromBasket(foundDelivery.ProductID)
								recalculateTotalPrice()
							return;
						};
						// add
						setActiveDeliveryAddress(true);
						setActiveDeliveryShop(false);
						
						addItemToBasket({
							Name: "Doručenie na adresu",
							SupplierID: 1,
							OrderID: null,
							Price: "2.00"
						})
						recalculateTotalPrice()
					}}>
					<p className="choosedeliverybtn-title">Doručenie <br></br>na adresu</p>
					<span className="choosedeliverybtn-subtitle">Za poplatok</span>
				</button>				
				</div>
			<form 
				ref={formRef}
				onSubmit={e => {
					e.preventDefault()
					onSubmit()
				}}>	
				<div className={isActiveDeliveryAddress ? "deliverytoaddress active" : "deliverytoaddress"}>
					<p className="catname">Doručovacie informácie</p>
					<select className="select" id="cities" required>
						<option value="" selected disabled>Vyberte miesto doručenia</option>
						<option value="x">Beňadiková (+2€)</option>
						<option value="x">Bobrovček (+2€)</option>
						<option value="x">Bobrovec (+2€)</option>
						<option value="x">Demänovská dolina (Jasná) (+2€)</option>
						<option value="x">Galovany (+2€)</option>
						<option value="x">Gôtovany (+2€)</option>
						<option value="x">Jakubovany (+2€)</option>
						<option value="x">Jalovec (+2€)</option>
						<option value="x">Jamník (+2€)</option>
						<option value="x">Konská (+2€)</option>
						<option value="x">Kvačany (+2€)</option>
						<option value="x">Liptovská Ondrášová (+2€)</option>
						<option value="x">Liptovská Porúbka (+2€)</option>
						<option value="x">Liptovská Sielnica (+2€)</option>
						<option value="x">Liptovské Matiašovce (+2€)</option>
						<option value="x">Liptovský Hrádok (+2€)</option>
						<option value="x">Liptovský Ján (+2€)</option>
						<option value="x">Liptovský Mikuláš (+2€)</option>
						<option value="x">Liptovský Mikuláš - Bodice (+2€)</option>
						<option value="x">Liptovský Mikuláš - časť Podbreziny (+2€)</option>
						<option value="x">Liptovský Mikuláš - Demänová (+2€)</option>
						<option value="x">Liptovský Mikuláš - Tatralandia (+2€)</option>
						<option value="x">Liptovský Ondrej (+2€)</option>
						<option value="x">Liptovský Peter (+2€)</option>
						<option value="x">Liptovský Trnovec (+2€)</option>
						<option value="x">Ľubeľa (+2€)</option>
						<option value="x">Okoličné (+2€)</option>
						<option value="x">Partizánska Ľupča (+2€)</option>
						<option value="x">Pavčina Lehota (+2€)</option>
						<option value="x">Pavlova Ves (+2€)</option>
						<option value="x">Ploštín / Iľanovo (+2€)</option>
						<option value="x">Podtureň (+2€)</option>
						<option value="x">Smrečany (+2€)</option>
						<option value="x">Svätý kríž (+2€)</option>
						<option value="x">Trstené (+2€)</option>
						<option value="x">Uhorská Ves (+2€)</option>
						<option value="x">Vavrišovo (+2€)</option>
						<option value="x">Závažná poruba (+2€)</option>
						<option value="x">Žiar (+2€)</option>
					</select>
					{/* <input className="input" placeholder="Miesto doručenia" {...city} required /> */}
					<input className="input" placeholder="Ulica a číslo domu" {...address} required />
					{/* <input className="input" placeholder="PSČ" {...postCode} required /> */}
				</div>

				<p className="catname">Kontakte informácie</p>
				<input className="input" placeholder="Meno" {...name} required />
				<input className="input" placeholder="Priezvisko" {...lastName} required />

				<input className="input" placeholder="Email" {...email} required />
				<input className="input" placeholder="Tel. číslo" {...tel} required />
				<textarea className="textarea" placeholder="Poznámka" {...message} />
			<div className="footer footer-shadow ">
				<BottomBar />
				<div className="btngroup">
					<Link to="/supplier-offer" className="button button-back">
						<span className="">
						&lt;
						</span>
					</Link>
					<Link to="/goodbye" className="button button-full" onClick={() => formRef.current.dispatchEvent(new Event("submit"))}>
						<span>
							Objednať
						</span>
					</Link>
				</div>
			</div>
			</form>		
		
		</div>
	)
}


function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  };

  return {
    value,
    onChange: handleChange,
  };
}