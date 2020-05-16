import React from 'react'

export function RegistrationTemplate({registrationData}) {
	return (
		<ul>
			{generateList(registrationData)}
		</ul>
	)
}

const generateList = (registrationData) => (
	Object.keys(registrationData).map((key, i) => {
		return <li key={key}>{key}: {registrationData[key]}</li>
	})
)