import React, { useState, useContext, useRef } from "react";
import ReactDOMServer from 'react-dom/server';
import selectboxArrow from "../../img/arrow-selectbox.png";
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";
import { SupplierEmailTemplate } from "../email-templates/SupplierEmailTemplate";
import { CustomerEmailTemplate } from "../email-templates/CustomerEmailTemplate";
import { cities } from "../../cities";
import { productExceedStoreCount } from "../../utils";

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

	const updateSelectedCity = (city) => {
		dispatch({
			type: "UPDATE_SELECTED_CITY",
			payload: city
		});
	}

	const validForm = () => {
		// const customerRequiredInfo = [{'name': name.value}, {'lastName': lastName.value}, {'email': email.value}, {'tel': tel.value}];
		const customerRequiredInfo = [name.value, lastName.value, email.value, tel.value];
		let validedInput = 0;
		customerRequiredInfo.forEach(x => {
			if (x !== '') {
				validedInput += 1;
			} 
		});

		if (validedInput === customerRequiredInfo.length) {
			return true;
		} 
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
		formDataAddress.append('SupplierID', '0');
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
		formData.append('SupplierID', '0');
		const options = {
			method: 'POST',
			body: formData,
		}
		const resOrder = await fetch('https://fecko.org/productdelivery/Order/create', options);
		const jsonOrder = await resOrder.json();
		console.log('jsonOrder', jsonOrder);
		dispatch({
			type: "SEND_PERSONAL_FORM",
			payload: { 
				id: 0,
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
		
		const productExceedCount = productExceedStoreCount(state.basket)

		if(productExceedCount.doesExceed) {
			alert(`Prekročený limit produktu ${productExceedCount.exceedItem.Name} prosím zopakujte objednávku a vyberte si nižší počet produktu.`)
			return;
		}

		state.basket.map(async item => {
			const nextStoreCount = item.StoreCount - item.count;
			// update product StoreCount
			let itemDecreasedStoreCount = {
				ProductID: item.ProductID,
				SupplierID: item.SupplierID,
				ProductCategoryID: item.ProductCategoryID,
				OrderID: 1, //TODO: update to dynamic
				Name: item.Name,
				Price: item.Price,
				Description: item.Description,
				StoreCount: nextStoreCount < 0 ? 0 : nextStoreCount, // just in case
			}
		
			let formDataProduct = getFormData(itemDecreasedStoreCount)
			let optionsProduct = {
				method: 'POST',
				body: formDataProduct,
			}
			let updatedProduct = await fetch(`https://fecko.org/productdelivery/Product/update/${item.ProductID}`, optionsProduct)
			console.log('updatedProduct', updatedProduct)
		})
		
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
		const supplierInfo = {
			PhoneNumber: '+421 911 705 160',
			OpeningHoursFrom: '8:00',
			OpeningHoursTo: '18:00',
			Name: "MŠ Lobelka"
		}
		// vytvorit email
		const data = {
			// to: "marianmrva123@gmail.com",
			to: "gorazd.ratulovsky@gmail.com",
			header: "Nová objednávka",
			body: ReactDOMServer.renderToStaticMarkup(
				<SupplierEmailTemplate
					basket={state.basket}
					personalInfo={personalInfo}
					deliveryInfo={deliveryInfo}
					supplierInfo={supplierInfo}
					deliveryType={state.deliveryType}
					totalPrice={state.totalPrice}
					selectedCity={state.selectedCity}
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

		// CustomerEmailTemplate
		const dataCustomer = {
			to: email.value,
			header: "Potvrdenie o objednávke",
			body: ReactDOMServer.renderToStaticMarkup(
				<CustomerEmailTemplate
					basket={state.basket}
					personalInfo={personalInfo}
					deliveryInfo={deliveryInfo}
					supplierInfo={supplierInfo}
					deliveryType={state.deliveryType}
					totalPrice={state.totalPrice}
					selectedCity={state.selectedCity}
				/>
			),
		}
		const formDataSendEmailCustomerOption = {
			method: 'POST',
			body: JSON.stringify(dataCustomer),
		}
		const resCustomerEmail = await fetch('https://fecko.org/productdelivery/custom/create-mail', formDataSendEmailCustomerOption);
		const jsonCutomerEmail = await resCustomerEmail.json();
		console.log('jsonCutomerEmail', jsonCutomerEmail)
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
						updateSelectedCity(null);
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
					<p className="choosedeliverybtn-title">Vyzdvihnem <br></br>u nás</p>
					<span className="choosedeliverybtn-subtitle">od 11:00 do 12:00</span>
				</button>
				<button className={state.deliveryType === "NA_ADRESU" ? "choosedeliverybtn active" : "choosedeliverybtn"} onClick={() => {
						const foundDelivery = state.basket.filter(basketItem => basketItem.Name === "Doručenie na adresu")
						onSubmitDeliveryTypeChange("NA_ADRESU");
						// remove
						if (isActiveDeliveryAddress) {
							// setActiveDeliveryAddress(false);
							// setActiveDeliveryShop(false);
							if (foundDelivery)
								removeItemfromBasket(foundDelivery.ProductID)
								recalculateTotalPrice()
							return;
						};
						// add
						setActiveDeliveryAddress(true);
						setActiveDeliveryShop(false);
						
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
				<div className={state.deliveryType === "NA_ADRESU" ? "deliverytoaddress active" : "deliverytoaddress"}>
					<p className="catname">Doručovacie informácie</p>
					<div className="selectbox">
						<span className="selectbox-arrow" style={{backgroundImage: "url("+selectboxArrow+")"}}></span>
						<select 
							className="select"
							id="cities"
							value={state.selectedCity}
							required
							// {...city}
							onChange={event => {
								updateSelectedCity(event.target.options[event.target.selectedIndex].text)
								const foundDelivery = state.basket.filter(basketItem => basketItem.Name === "Doručenie na adresu")
								if (foundDelivery) {
									removeItemfromBasket(foundDelivery.ProductID)
									recalculateTotalPrice()
								}
								addItemToBasket({
									Name: "Doručenie na adresu",
									SupplierID: 1,
									OrderID: null,
									DeliveryCity:  event.target.options[event.target.selectedIndex].getAttribute('data-city'),
									Price: event.target.value.toString()
								})
								recalculateTotalPrice()
							}}>
						>
							<option value={state.selectedCity} selected disabled>{state.selectedCity || "Vyberte miesto doručenia *"}</option>
							{cities.map(city => (
								<option value={city.cena} data-city={city.nazov}>{city.nazov} (+{city.cena}€)</option>
							))}
						</select>
					</div>
					{/* <input className="input" placeholder="Miesto doručenia" {...city} required /> */}
					<input className="input" placeholder="Ulica a číslo domu *" {...address} required />
					{/* <input className="input" placeholder="PSČ" {...postCode} required /> */}
				</div>

				<p className="catname">Kontaktné informácie</p>
				<input className="input" type="text" placeholder="Meno *" {...name} required />
				<input className="input" type="text" placeholder="Priezvisko *" {...lastName} required />

				<input className="input" type="email" placeholder="Email *" {...email} required />
				<input className="input" type="text" placeholder="Tel. číslo *" {...tel} required />
				<textarea className="textarea" placeholder="Poznámka" {...message} />
				<small>* povinný údaj</small>
			<div className="footer footer-shadow ">
				<BottomBar />
				<div className="btngroup">
					<Link to="/supplier-offer" className="button button-back">
						<span className="">
						&lt;
						</span>
					</Link>
					{validForm() ? <Link to="/goodbye" className="button button-full" onClick={() => formRef.current.dispatchEvent(new Event("submit", { cancelable: true }))}><span>Objednať</span></Link> : <Link to="/goodbye" className="button button-full disabled" onClick={(e) => e.preventDefault()}><span>Objednať</span></Link>}
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

function getFormData(object) {
    const formData = new FormData();
    Object.keys(object).forEach(key => formData.append(key, object[key]));
    return formData;
}

