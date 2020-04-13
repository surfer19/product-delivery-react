
import React, {useReducer, createContext } from "react";
import { findIndex, propEq } from "ramda";
import produce from "immer"

export const ContactContext = createContext();

const initialState = {
  count: 0,
  basket: [],
  totalPrice: 0,
  personalData: {},
  deliveryType: 'NA_PREDAJNI',
  selectedCity: null
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
			// console.log('action.payload.count', action.payload.count)
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
				selectedCity: action.payload
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