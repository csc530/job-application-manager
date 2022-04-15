// * Load jobs synchronously using socket connection
document.addEventListener('DOMContentLoaded', () => {
	const search = document.getElementById('search');
	const form = document.getElementById('form');
	const tbody = document.querySelector('table#results tbody');
	const table = document.querySelector('table#results')

	// * loading preloader elements
	const loadingTxt = document.querySelector('section#loading h1.loader__text');
	const loadingSection = document.querySelector('section#loading');

	const url = window.location.protocol.replace('http','ws') + '//' + window.location.hostname + ':' + window.location.port;
	const socket = new WebSocket(url);

	socket.onopen = event => {
		console.log('Connected to ' + url);
		socket.onmessage = message => {
			const jobs = JSON.parse(message.data);
			if(jobs.length === 0)
				loadingTxt.textContent = 'No jobs found';
			else{
				loadingSection.classList.add('is-hidden');
				updateTable(jobs);
				sorttable.makeSortable(table);
			}
		};
	};

	form.addEventListener('submit', event => {
		event.preventDefault();
		const data = search.value.trim();
		const rows = document.querySelectorAll('table#results tbody tr');
		// ? deleate the rows; of previous query
		rows.forEach(row => row.remove());
		loadingSection.classList.remove('is-hidden');
		loadingTxt.textContent = `Searching Indeed for '${data}'`;
		socket.send(data);
	});

	function updateTable(jobs) {
		for(let i = 0; i < jobs.length; i++) {
			const job = jobs[i];
			const row = document.createElement('tr');
			const title = document.createElement('td');
			const snippet = document.createElement('td');
			const salary = document.createElement('td');
			const postedDate = document.createElement('td');
			const actions = document.createElement('td');
			const company = document.createElement('td');
			const location = document.createElement('td');


			// 'job-link', 'job-title', 'company-name', , 'job-snippet', 'job-salary', 'post-date'
			// * Only add if they're signed in; hacky way to check if the navbar displays their username
			if(document.querySelector('body header nav a + a#user-name')) {
				const add = document.createElement('a');
				add.classList.add('button', 'is-primary', 'is-fullwidth');
				add.textContent = 'Add';
				add.href = '/indeed/add?title=' + job['job-title'] + '&link=' + job['job-link'];
				actions.appendChild(add);
			}

			const view = document.createElement('a');
			view.classList.add('button', 'is-info', 'is-fullwidth');
			view.textContent = 'Open in Indeed';
			view.href = job['job-link'];
			view.target = '_blank';
			view.rel = 'noopener noreferrer';
			actions.appendChild(view);

			const info = [title, company, snippet, location, salary, postedDate, actions];

			title.textContent = job['job-title'];
			snippet.textContent = job['job-snippet'];
			salary.textContent = job['job-salary'];
			postedDate.textContent = job['post-date'];
			if(job['company-rating'])
				company.innerHTML = `${job['company-name']}
			<br/>
			<strong>Rating: ${job['company-rating']}/5</strong>`;
			else
				company.textContent = job['company-name'];
			location.textContent = job['company-location'];

			info.forEach(item => row.appendChild(item));
			tbody.appendChild(row);
		}
	}

});
