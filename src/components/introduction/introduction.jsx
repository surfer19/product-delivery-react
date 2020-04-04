import React, { useEffect, useState }  from 'react'
import logo from "../../img/logo.jpeg";

export function Introduction() {
	const [commitHistory, setCommitHistory] = useState([]);

	useEffect(() => {
		fetch(
		  `https://api.github.com/search/commits?q=repo:facebook/react+css&page=${1}`,
		  {
			method: "GET",
			headers: new Headers({
			  Accept: "application/vnd.github.cloak-preview"
			})
		  }
		)
		  .then(res => res.json())
		  .then(response => {
			console.log('response', response.items)
			setCommitHistory(response.items)
		  })
		  .catch(error => console.log(error));
	  }, []);
	
	return (
		<>
			<h3>Restauracia Burina</h3>
			<p>Nejake info o restike</p>
			<img src={logo} alt=""/>

			<p>facebook commits: </p>
			<ul>
				{commitHistory.map(commit => (
					<li key={commit.sha}>{commit.url}</li>
				))}
			</ul>
		</>
	)
}

export default Introduction
