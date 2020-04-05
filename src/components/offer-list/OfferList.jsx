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
			{product.Name}
			{product.Price}€
			{product.Description}
			<span>{count}</span>
			<button onClick={() =>{ 
				addItemToBasket(product)
				setCount(count+1)
				recalculateTotalPrice()
			}}
			>+</button>
			<button onClick={() =>{ 
				removeItemfromBasket(product.ProductID)
				setCount(count > 0 ? count-1 : count)
				recalculateTotalPrice()
			}}
			> -
			</button>
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
					<BottomBar />
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