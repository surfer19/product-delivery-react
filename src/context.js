
import React, {useReducer, createContext } from "react";
import { findIndex, propEq } from "ramda";
import produce from "immer"

export const ContactContext = createContext();
export const ON_STORE = 'NA_PREDAJNI';

const initialState = {
  count: 0,
  basket: [],
  totalPrice: 0,
  personalData: {},
  deliveryType: ON_STORE,
  selectedCity: {
	placeholder: null,
	price: 0
  }
};

const reducer = (state, action) => {
  switch (action.type) {
	  	// case "GET_BASKET_ITEM_COUNT"
		case "ADD_TO_BASKET":
			const foundItemBasketIdx = state.basket.findIndex(item => item.ProductID === action.payload.ProductID)
			if (foundItemBasketIdx !== -1) {
				const itemToUpdate = state.basket[foundItemBasketIdx]
				// update item
				const updatedBasket = produce(state.basket, draft => {
					draft[foundItemBasketIdx] = {
						...itemToUpdate,
						count: (itemToUpdate.count + 1)//.toString()
					}
				});
				return {
					...state,
					basket: updatedBasket,
				}
			}
			return {
				...state,
				basket: [...state.basket, {
					...action.payload,
					count: 1
				}]
			}
		case "REMOVE_FROM_BASKET":			
			const basketItems = [...state.basket]
			const idx = findIndex(propEq('ProductID', action.payload))(basketItems);
			// item not exists
			if (idx === -1) {
				return {
					...state
				}
			}
			// exist more than one item
			if (basketItems[idx].count > 1) {
				let itemToUpdate = state.basket[idx]
				// update item
				let updatedBasket = produce(state.basket, draft => {
					draft[idx] = {
						...itemToUpdate,
						count: itemToUpdate.count - 1
					}
				});
				return {
					...state,
					basket: updatedBasket
				}
			}

			basketItems.splice(idx, 1);
			return {
				...state,
				basket: basketItems
			}

		case "RECALCULATE_TOTAL_PRICE":
			let reducer = (accumulator, currentValue) => {
				const count = parseFloat(accumulator) + parseFloat(currentValue.Price) * currentValue.count;
				return count.toFixed(2);
			}
			return {
				...state,
				totalPrice: state.basket.map(item => item).reduce(reducer, 0)
			}
		case "SEND_PERSONAL_FORM":
			return {
				...state,
				personalData: {...action.payload},
			};
		
		case "UPDATE_DELIVERY": 
			return {
				...state,
				deliveryType: action.payload
			};
		
		case "UPDATE_SELECTED_CITY":
			return {
				...state,
				selectedCity: {
					placeholder: action.payload.placeholder,
					price: action.payload.price
				}
			}
		case "UPDATE_DELIVERY_BASKET":
			if (state.deliveryType === ON_STORE) {
				return { ...state }
			}
			const foundDevilveryItemIdx = state.basket.findIndex(item => item.Name === "Doručenie na adresu");
			let activeCategories = getNumberSelectedCategories(state.basket)
			// not found
			if (foundDevilveryItemIdx === -1) {
				// add item to basket
				// state.selectedCity.price				
				const newItem = {
					Name: "Doručenie na adresu",
					ProductID: 0,
					SupplierID: 1,
					OrderID: null,
					count: activeCategories,
					DeliveryCity: state.selectedCity.placeholder,
					Price: state.selectedCity.price
				}
				return {
					...state,
					basket: [
						...state.basket,
						newItem
					]
				}
			}
			const updatedBasket = produce(state.basket, draft => {
				draft[foundDevilveryItemIdx] = {
					...state.basket[foundDevilveryItemIdx],
					count: activeCategories,
					DeliveryCity: state.selectedCity.placeholder,
					Price: state.selectedCity.price
				}
			});
			return {
				...state,
				basket: updatedBasket
			}
    default:
      throw new Error();
  }
};

export const ContactContextProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <ContactContext.Provider value={[state, dispatch]}>
      {props.children}
    </ContactContext.Provider>
  );
};

export function getNumberSelectedCategories(basketProducts) {
	const categoryIds = basketProducts.map(product => product.ProductCategoryID).filter(id => id);
	let categoriesSet = new Set(categoryIds);
	return categoriesSet.size;
}