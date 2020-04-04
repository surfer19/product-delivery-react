import React from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { isEmpty } from 'ramda';

export function OfferList() {	
	return (
		<GlobalContext.Consumer>
			{state => (
				<>
					<p>VYBER Z PONUKY</p>
					<ul>
						{state.categoryProductList.map(categoryProducts => {
							return (
								<li key={categoryProducts.ProductCategoryID}>
									{categoryProducts.Name}
									<ul>
										{renderCategoryProducts(categoryProducts)}
									</ul>
								</li>
							)
						})}
					</ul>
					<Link to="/customer-form">
						<button>
							vase udaje
						</button>
					</Link>
				</>
			)}
		</GlobalContext.Consumer>
	)
}

const renderCategoryProducts = (categoryProducts) => {
	if (!categoryProducts || isEmpty(categoryProducts.listProducts)) return "Žiadna ponuka pre tento deň";
	return categoryProducts.listProducts.map(product => (
		<li key={product.ProductID}>
			{product.Name}
			{product.Price}€
			{product.Description}
			<span>-</span>
			<button>+</button>
			<button>-</button>
		</li>
	))
}