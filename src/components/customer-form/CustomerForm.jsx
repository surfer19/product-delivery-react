import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";

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

				<p class="catname">Doručenie objednávky</p>
				<button onClick={() => onSubmitDeliveryTypeChange("NA_PREDAJNI")}>Vyzvihnem <br></br>na predajni</button>
				<button onClick={() => onSubmitDeliveryTypeChange("NA_ADRESU")}>Doručenie <br></br>na adresu</button>
				
				<p class="catname">Kontakte informácie</p>
				<form 
					onSubmit={e => {
						e.preventDefault()
						onSubmit()
					}}
				>
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