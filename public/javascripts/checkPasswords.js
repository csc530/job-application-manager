const validatePassword = () => {
	const password = document.getElementById('password');
	const confirmPassword = document.getElementById('passwordConfirm');
	// console.log(`password.value = ${!!password.value}
    // confirmPassword.value = ${!!confirmPassword.value}
    // password.value !== confirmPassword.value = ${password.value !== confirmPassword.value}
    // password.value.length > 0 = ${password.value.length > 0}
    // confirmPassword.value.length > 0 = ${confirmPassword.value.length > 0}`);
	if(password.value && confirmPassword.value && password.value === confirmPassword.value && password.value.length > 0 && confirmPassword.value.length > 0) {
		confirmPassword.classList.remove('is-danger');
		confirmPassword.classList.add('is-success');
		return true;
	}
	else{
		confirmPassword.classList.add('is-danger');
		confirmPassword.classList.remove('is-success');
		return false;
	}
};

function setupDialog() {
	const dialog = document.getElementById('dialogMismatchPassword');
	dialog.querySelectorAll('button').forEach(button =>
		button.addEventListener('click', () =>
			dialog.classList.remove('is-active'))
	);
}

setupDialog();

document.getElementById('password').addEventListener('keyup', validatePassword);
document.getElementById('passwordConfirm').addEventListener('keyup', validatePassword);

document.getElementById('registerForm').addEventListener('submit', (e) => {
	if(!validatePassword()) {
		e.preventDefault();
		document.getElementById('dialogMismatchPassword').classList.add('is-active');
	}
});

