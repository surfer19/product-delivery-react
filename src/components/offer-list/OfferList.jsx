import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { isEmpty } from 'ramda';
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar";

export function ProductItem({product, addItemToBasket, removeItemfromBasket, recalculateTotalPrice}) {
	const [state, dispatch] = useContext(ContactContext);
	let productBasketItem = state.basket.find(item => item.ProductID === product.ProductID)
	let count = productBasketItem ? productBasketItem.count : 0;
	return (
		<li key={product.ProductID} class={count > 0 ? "active" : ""}>
			<span class="product-inner" onClick={() => {
				// already exists -> remove
				if (productBasketItem) {
					removeItemfromBasket(product.ProductID);
					recalculateTotalPrice();
					return;
				};
					addItemToBasket(product);
					recalculateTotalPrice();
				}} 
			>
				<span class="product-name">{product.Name}</span>
				<span class="product-price">{product.Price} €</span>
				<p class="product-desc">{product.Description}</p>
			</span>
			
			
			<div class="product-amount">
				<span class="product-amount-title">Zadajte množstvo</span>

				<div class="product-amount-div">
					<button onClick={() =>{ 
						console.log('--')
						removeItemfromBasket(product.ProductID)
						recalculateTotalPrice()
					}}
					> -
					</button>
					<span>{count}</span>
					<button onClick={() =>{ 
						console.log('++')
						addItemToBasket(product)
						recalculateTotalPrice()
					}}
					>+</button>
				</div>
				
			</div>
		</li>
	)
}

export function OfferList() {	
	const [state, dispatch] = useContext(ContactContext);
	
	const renderCategoryProducts = (categoryProducts) => {
		if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
		return categoryProducts.listProducts.map(product => {
			return <ProductItem
				product={product}
				addItemToBasket={addItemToBasket}
				removeItemfromBasket={removeItemfromBasket}
				recalculateTotalPrice={recalculateTotalPrice}
			/>
		})
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

	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					<div class="wrapper">
						<ul class="shopheader">
							<li class="active">
								<span class="shopheader-num">1</span>
								<span class="shopheader-title">Výber <br></br>z ponuky</span>
							</li>
							<li>
								<span class="shopheader-num">2</span>
								<span class="shopheader-title">Vaše <br></br>údaje</span>
							</li>
							<li>
								<span class="shopheader-num">3</span>
								<span class="shopheader-title">To je <br></br>všetko :)</span>
							</li>
						</ul>
						<ul class="noul">
							{state.categoryProductList.map(categoryProducts => {
								return (
									<li class="categorylist" key={categoryProducts.ProductCategoryID}>
										<p class="catname">{categoryProducts.Name}</p>
										<ul class="noul productlist">
											{renderCategoryProducts(categoryProducts)}
										</ul>
									</li>
								)
							})}
						</ul>
						
					</div>

					<div class="footer footer-shadow">
						<BottomBar />
						<Link to="/customer-form" class="button button-full">
							<span>
							POKRAČOVAŤ
							</span>
						</Link>
					</div>
				</>
			)}
		</GlobalContext.Consumer>
	)
	
}