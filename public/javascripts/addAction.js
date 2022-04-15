document.addEventListener('DOMContentLoaded', function () {
	const select = document.querySelector('form select#actions');
	const addOption = document.querySelector('form select#actions option#addAction');

	addOption.onselect = addAction;
	addOption.addEventListener('click', addAction);

	function addAction(event){
		event.preventDefault();
		addOption.selected = false;
		const action = prompt('Add action');

		if(!action)
			return;
		const option = document.createElement('option');
		option.text = action;
		option.value = action;
		select.add(option);
	}
});
