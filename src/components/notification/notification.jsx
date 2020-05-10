import React from 'react'
import { 
	Button,
	notification,
	Divider
} from 'antd';

export const showNotification = (placement, title = '', description = '') => {
	notification.success({
		message: title,
		description: description,
		placement: placement
	});
}
