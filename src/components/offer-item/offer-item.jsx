import React, {useContext, useState} from 'react'
import { ContactContext } from "../../context";

export function OfferItem({
	product,
	addItemToBasket,
	removeItemfromBasket,
	updateDisabledAddToBasket,
	recalculateTotalPrice,
	isDisabled
}) {
	const [state, dispatch] = useContext(ContactContext);
	let productBasketItem = state.basket.find(item => item.ProductID === product.ProductID)
	let count = productBasketItem ? productBasketItem.count : 0;
	let disabled = isDisabled ? "disabled" : "";
	let active = count > 0 ? "active" : "";
	return (
		<li key={product.ProductID} 
			className={`${active} ${disabled}`}
		>
			<span className="product-inner" onClick={() => {
				if (isDisabled) return;
				// already exists -> remove
				if (productBasketItem) {
					removeItemfromBasket(product.ProductID);
					recalculateTotalPrice();
					return;
				};
					addItemToBasket(product);
					recalculateTotalPrice();
					updateDisabledAddToBasket()
				}} 
			>
				<span className="product-name">{product.Name}</span>
				<span className="product-price">{product.Price} €</span>
				<p className="product-desc">{product.Description}</p>
			</span>
			
			
			<div className="product-amount">
				<span className="product-amount-title">Zadajte množstvo</span>

				<div className="product-amount-div">
					{/* REMOVE */}
					<button onClick={() => {
						if (isDisabled) return;
						removeItemfromBasket(product.ProductID)
						recalculateTotalPrice()
					}}
					> -
					</button>
					<span>{count}</span>
					{/* ADD */}
					<button
						className={productBasketItem && productBasketItem.disabled ? "disabled" : ""}
						onClick={() => { 
							if (isDisabled || productBasketItem.disabled) return;
							addItemToBasket(product)
							recalculateTotalPrice()
							updateDisabledAddToBasket()
						}}
					>+</button>
				</div>
				
			</div>
		</li>
	)
}
