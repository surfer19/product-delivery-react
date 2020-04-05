import React, {useContext, useState} from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { isEmpty } from 'ramda';
import { ContactContext } from "../../context";
import { BottomBar } from "../bottom-bar/BottomBar"

export function ProductItem({product, addItemToBasket, removeItemfromBasket, recalculateTotalPrice}) {
	const [count, setCount] = useState(0)
	return (
		<li key={product.ProductID}>
			<span class="product-name">{product.Name}</span>
			<span class="product-price">{product.Price} €</span>
			<p class="product-desc">{product.Description}</p>
			
			
			<div class="product-amount">
				<button onClick={() =>{ 
					removeItemfromBasket(product.ProductID)
					setCount(count > 0 ? count-1 : count)
					recalculateTotalPrice()
				}}
				> -
				</button>
				<span>{count}</span>
				<button onClick={() =>{ 
					addItemToBasket(product)
					setCount(count+1)
					recalculateTotalPrice()
				}}
				>+</button>
			</div>
		</li>
	)
}

export function OfferList() {	
	const [state, dispatch] = useContext(ContactContext);
	console.log('ddd')
	console.log('state', state)
	
	const renderCategoryProducts = (categoryProducts) => {
		if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
		return categoryProducts.listProducts.map(product => (
			<ProductItem
				product={product}
				addItemToBasket={addItemToBasket}
				removeItemfromBasket={removeItemfromBasket}
				recalculateTotalPrice={recalculateTotalPrice}
			/>
		))
	}
	
	const removeItemfromBasket = id => {
		dispatch({
			type: "REMOVE_FROM_BASKET",
		    payload: id
		});
	}

	const addItemToBasket = item => {
		console.log('itemitem', item)
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
									<li key={categoryProducts.ProductCategoryID}>
										<p class="catname">{categoryProducts.Name}</p>
										<ul class="noul productlist">
											{renderCategoryProducts(categoryProducts)}
										</ul>
									</li>
								)
							})}
						</ul>
						{/* <BottomBar /> */}
					</div>

					<div class="footer footer-shadow">
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