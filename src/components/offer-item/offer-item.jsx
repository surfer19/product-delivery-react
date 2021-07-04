import React, {useContext, useState} from 'react'
import { ContactContext } from "../../context";
import { isEmpty } from "ramda";
import moment from "moment";

export function OfferItem({
	product,
	addItemToBasket,
	removeItemfromBasket,
	updateDisabledAddToBasket,
	recalculateTotalPrice,
	isDisabled,
	categoryProducts,
}) {
	const [state, dispatch] = useContext(ContactContext);
	let productBasketItem = state.basket.find(item => item.ProductID === product.ProductID)
	let count = productBasketItem ? productBasketItem.count : 0;
	// disable decision
	let isItemInCategorySelected = !isEmpty(state.selectedCategoryProducts.filter(prod => prod.ProductID === product.ProductID))
	const isDateValid = moment(new Date(product.ProductCategoryDate), true).isValid();
	let isDisabledCategoryItem = (!isItemInCategorySelected && state.basket.length > 0 && isDateValid)
	let finalDisabledDecision = isDisabled || isDisabledCategoryItem;
	let disabled = finalDisabledDecision ? "disabled" : "";

	let active = count > 0 ? "active" : "";
	return (
		<li key={product.ProductID} 
			className={`${active} ${disabled}`}
		>
			<span className="product-inner" onClick={() => {
				if (finalDisabledDecision) return;
				// already exists -> remove
				if (productBasketItem) {
					removeItemfromBasket(product.ProductID);
					recalculateTotalPrice();
					return;
				};
					addItemToBasket(product);
					recalculateTotalPrice();
					updateDisabledAddToBasket()
					updateDisabledCategoryItems(dispatch, product, categoryProducts)
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
							updateDisabledCategoryItems(dispatch, product, categoryProducts)
						}}
					>+</button>
				</div>
				
			</div>
		</li>
	)
}

const updateDisabledCategoryItems = (dispatch, selectedItem, categoryProducts) => {
	dispatch({
		type: "UPDATE_SELECTED_CATEGORY_PRODUCTS",
		payload: {
			selectedItem,
			categoryProducts: categoryProducts.listProducts,
		}
	})
}