
import React, {useReducer, createContext } from "react";
import { findIndex, propEq, head } from "ramda";
import produce from "immer"

export const ContactContext = createContext();

const initialState = {
  count: 0,
  basket: [],
  selectedCategoryProducts: [],
  totalPrice: 0,
  personalData: {},
  deliveryType: 'NA_PREDAJNI',
  selectedCity: null
};

const reducer = (state, action) => {
  switch (action.type) {
	  	case "UPDATE_DISABLED_ADD_TO_BASKET":
			const disabledBasket = state.basket.map(item => {
				if(item.StoreCount - item.count < 1){
					// disabled
					return {
						...item,
						disabled: true
					}
				}
				return {
					...item,
					disabled: false
				}
			})
			return {
				...state,
				basket: disabledBasket
			}
		case "ADD_TO_BASKET":
			const foundItemBasketIdx = state.basket.findIndex(item => item.ProductID === action.payload.ProductID)
			if (foundItemBasketIdx !== -1) {
				const itemToUpdate = state.basket[foundItemBasketIdx]
				// update item
				const updatedBasket = produce(state.basket, draft => {
					draft[foundItemBasketIdx] = {
						...itemToUpdate,
						disabled: false,
						count: (itemToUpdate.count + 1)//.toString()
					}
				});
				return {
					...state,
					basket: updatedBasket,
				}
			}
			// default
			return {
				...state,
				basket: [...state.basket, {
					...action.payload,
					disabled: false,
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
				selectedCity: action.payload
			}
		case "UPDATE_SELECTED_CATEGORY_PRODUCTS":
			// clicked item ->
			const updatedItem = action.payload.selectedItem;
			// doesnt update for categories without date
			if (updatedItem.ProductCategoryDate === "") {
				return {
					...state
				};
			}
			const categoryProducts = action.payload.categoryProducts;
			// found category -> active
			const itemsToMakeActive = categoryProducts.filter(
				item => updatedItem.ProductCategoryID === item.ProductCategoryID
			)
			
			return {
				...state,
				selectedCategoryProducts: itemsToMakeActive,
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