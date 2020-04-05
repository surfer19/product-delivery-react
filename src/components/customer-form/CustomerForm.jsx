import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";
import { useFetch } from "../../hooks/useFetch";

export function CustomerForm() {
	const [state, dispatch] = useContext(ContactContext);
	const [isActiveDeliveryShop, setActiveDeliveryShop] = useState(false)
	const [isActiveDeliveryAddress, setActiveDeliveryAddress] = useState(false)
	const name = useFormInput("");
	const lastName = useFormInput("");
	const email = useFormInput("");
	const tel = useFormInput("");
	const message = useFormInput("");

	console.log('state', state)
	
	async function onSubmitDeliveryTypeChange (deliveryType) {
		dispatch({
			type: "UPDATE_DELIVERY",
			payload: deliveryType
		});
		console.log('state', state);
	}

	// 	// const fetchData = async () => {
	// 	// try {
	// 	const res = await fetch('https://fecko.org/productdelivery/Order/create', options);
	// 	// const json = await res;
	// 	console.log('res', res)
	// 	// } catch (error) {
	// 	// 	throw Error()
	// 	// }
	// 	// }
	// 	// const data = await fetchData()
	// 	// console.log('res', res)
			
	// 	// const supplierProducts = useFetch("https://fecko.org/productdelivery/Order/create", {}).response;
	// 	// console.log('supplierProducts', supplierProducts)
	// }


	async function onSubmit() {
		//
		let formDataCustomer = new FormData();
		formDataCustomer.append('Name', name);
		formDataCustomer.append('LastName', lastName);

		const optionPost = {
			method: 'POST',
		}
		const resCustomer = await fetch('https://fecko.org/productdelivery/Customer/create', optionPost);
		const jsonCustomer = await resCustomer.json();
		console.log('jsonCustomer', jsonCustomer);
		console.log('resCustomer', resCustomer);

		let formData = new FormData();
		formData.append('CustomerID', '1');
		formData.append('SupplierID', '1');

		const options = {
			method: 'POST',
			body: formData,
		}

		dispatch({
			type: "SEND_PERSONAL_FORM",
			payload: { 
				id: 1,
				name: name.value,
				lastName: name.lastName,
				email: email.value,
				tel: tel.value,
				message: message.value,
			}
		});

		const res = await fetch('https://fecko.org/productdelivery/Order/create', options);
		const json = await res.json();
		console.log('res', json)
	}

	return (
		<div>
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
							onSubmitDeliveryTypeChange("NA_ADRESU");
							// setActiveDeliveryAddress(true);
							if (isActiveDeliveryAddress) {
								setActiveDeliveryAddress(false);
								setActiveDeliveryShop(false);
								return;
							};
							setActiveDeliveryAddress(true);
							setActiveDeliveryShop(false);
						}}>
					{/* <button class="choosedeliverybtn" onClick={() => onSubmitDeliveryTypeChange("NA_ADRESU")}> */}
						<p class="choosedeliverybtn-title">Doručenie <br></br>na adresu</p>
						<span class="choosedeliverybtn-subtitle">Poplatok <strong>+ 2€</strong></span>
					</button>	
				</div>
				
				
				<form 
					onSubmit={e => {
						e.preventDefault()
						onSubmit()
					}}
				>	
					<p class="catname">Kontakte informácie</p>
					<input class="input" placeholder="Meno" {...name} required />
					<input class="input" placeholder="Priezvisko" {...name} required />
					<input class="input" placeholder="Email" {...email} required />
					<input class="input" placeholder="Tel. číslo" {...tel} required />
					<textarea class="textarea" placeholder="Poznámka" {...message} />
					{/* type="email" */}
					<button fluid primary>
						New Contact
					</button>
				</form>		
				{/* <Link to="/goodbye">
					<button>
						Potvrdit Udaje
					</button>
				</Link> */}
			</div>
			<div class="footer footer-shadow ">
				<BottomBar />
				<div class="btngroup">
					<Link to="/supplier-offer" class="button button-back">
						<span class="">
						&lt;
						</span>
					</Link>
					<Link to="/goodbye" class="button button-full">
						<span>
						Objednať
						</span>
					</Link>
				</div>
			</div>
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