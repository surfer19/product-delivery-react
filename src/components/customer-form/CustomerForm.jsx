import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";

export function CustomerForm() {
	const [state, dispatch] = useContext(ContactContext);
	const name = useFormInput("");
	const email = useFormInput("");
	const tel = useFormInput("");
	const message = useFormInput("");

	console.log('state', state)
	const onSubmit = () => {
	  dispatch({
		type: "SEND_PERSONAL_FORM",
		payload: { 
			id: 1,
			name: name.value,
			email: email.value,
			tel: tel.value,
			message: message.value,
		}
	  });
	};
	
	const onSubmitDeliveryTypeChange = (deliveryType) => {
		dispatch({
			type: "UPDATE_DELIVERY",
			payload: deliveryType
		});
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
				<button onClick={() => onSubmitDeliveryTypeChange("NA_PREDAJNI")}>NA PREDAJNI</button>
				<button onClick={() => onSubmitDeliveryTypeChange("NA_ADRESU")}>DORUCENIE NA ADRESU</button>
				<form 
					onSubmit={e => {
						e.preventDefault()
						onSubmit()
					}}
				>
					<input placeholder="Meno a priezvisko" {...name} required />
					<input placeholder="Email" {...email} required />
					<input placeholder="Tel. cislo" {...tel} required />
					<textarea placeholder="poznamka" {...message} />
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
			<div class="footer footer-shadow btngroup">
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