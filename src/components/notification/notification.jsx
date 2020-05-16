import React from 'react'
import { 
	Button,
	notification,
	Divider
} from 'antd';

export const showNotification = (placement, title = '', description = '', duration = 4.5) => {
	notification.success({
		message: title,
		description: description,
		placement: placement,
		duration: duration
	});
}
