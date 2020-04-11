import React, { useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";

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

		// vytvorit email
		const data = {
			customer: {
				Name: name.value,
				LastName: lastName.value,
				Email: email.value,
				Telephone: tel.value,
				message: message.value,
				productsOrdered: state.basket.map(product => ({
					productCategory: "<p>categoria</p>",
					productName: product.Name,
					productDescription: product.Description,
					productCount: "1",
					productPrice: product.Price
				}))
			}
		}
		console.log('data', data)
		const formDataSendEmailOption = {
			method: 'POST',
			body: JSON.stringify(data),
		}
		const resEmail = await fetch('https://fecko.org/productdelivery/custom/send-mail', formDataSendEmailOption);
		const jsonEmail = await resEmail.json();
		console.log('jsonEmail', jsonEmail)
	}

	return (
		<div class="wrapper">
			<ul class="shopheader">
				<li class="active">
					<span class="shopheader-num">1</span>
					<span class="shopheader-title">Výber <br></br>z ponuky</span>
				</li>
				<li class="active">
					<span class="shopheader-num">2</span>
					<span class="shopheader-title">Vaše <br></br>údaje</span>
				</li>
				<li>
					<span class="shopheader-num">3</span>
					<span class="shopheader-title">To je <br></br>všetko :)</span>
				</li>
			</ul>

			<p class="catname">Doručenie objednávky</p>
			<div class="choosedeliverybtn-group">
				<button class={isActiveDeliveryShop ? "choosedeliverybtn active" : "choosedeliverybtn"} onClick={() => {
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
					<p class="choosedeliverybtn-title">Vyzvihnem <br></br>na predajni</p>
					<span class="choosedeliverybtn-subtitle">od 11:00 do 15:00</span>
				</button>
				<button class={isActiveDeliveryAddress ? "choosedeliverybtn active" : "choosedeliverybtn"} onClick={() => {
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
					<p class="choosedeliverybtn-title">Doručenie <br></br>na adresu</p>
					<span class="choosedeliverybtn-subtitle">Poplatok <strong>+ 2€</strong></span>
				</button>				
				</div>
			<form 
				ref={formRef}
				onSubmit={e => {
					e.preventDefault()
					onSubmit()
				}}>	
				<div class={isActiveDeliveryAddress ? "deliverytoaddress active" : "deliverytoaddress"}>
					<p class="catname">Doručovacie informácie</p>
					<input class="input" placeholder="Meno" {...name} required />
					<input class="input" placeholder="Priezvisko" {...lastName} required />
					<input class="input" placeholder="Mesto" {...city} required />
					<input class="input" placeholder="Ulica a číslo domu" {...address} required />
					<input class="input" placeholder="PSČ" {...postCode} required />
				</div>

				<p class="catname">Kontakte informácie</p>
				<input class="input" placeholder="Meno" {...name} required />
				<input class="input" placeholder="Priezvisko" {...lastName} required />

				<input class="input" placeholder="Email" {...email} required />
				<input class="input" placeholder="Tel. číslo" {...tel} required />
				<textarea class="textarea" placeholder="Poznámka" {...message} />
			<div class="footer footer-shadow ">
				<BottomBar />
				<div class="btngroup">
					<Link to="/supplier-offer" class="button button-back">
						<span class="">
						&lt;
						</span>
					</Link>
					<Link to="/goodbye" class="button button-full" onClick={() => formRef.current.dispatchEvent(new Event("submit"))}>
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