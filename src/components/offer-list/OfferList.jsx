import React from 'react'
import { Link } from "react-router-dom";
import { GlobalContext } from "../../App";
import { isEmpty } from 'ramda';

export function OfferList() {
	const arr = [
		{
			category: 'Pondelok 7.4.2020',
			listProducts: [
				{
					Name: 'Spiz',
					Price: '4.20€',
					Description: ' alergeny blabla',
				},
				{
					Name: 'halusky',
					Price: '4.44€',
					Description: ' alergeny blabla',
				}
			]
		},
		{
			category: 'Utorok 8.4.2020',
			listProducts: [
				{
					Name: 'Spiz 2',
					Price: '4.30€',
					Description: 'NEJAKE alergeniky blabla',
				}
			]
		}
	]
	
	console.log('arr', arr)
	
	return (
		<div>
			<p>VYBER Z PONUKY</p>
			<GlobalContext.Consumer>
			{state => (
				<>
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
		</div>
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