// ================================================================
// Prevents both checkboxes from being checked at once
// checking one will uncheck other
// ================================================================
const sanAntonioCheck = document.getElementById('sanAntonio');
const boerneCheck = document.getElementById('boerne');
sanAntonioCheck.addEventListener('click', function () {
	if (sanAntonioCheck.checked) {
		if (boerneCheck.checked) {
			boerneCheck.click();
		}
	}
});
boerneCheck.addEventListener('click', function () {
	if (boerneCheck.checked) {
		if (sanAntonioCheck.checked) {
			sanAntonioCheck.click();
		}
	}
});

// moves focus to next input and prevents submit on enter key

const name = document.getElementById('name');
name.addEventListener('keypress', function (e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		email.focus();
		return;
	}
});
const email = document.getElementById('email');
email.addEventListener('keypress', function (e) {
	if (e.keyCode == 13) {
		e.preventDefault();
		sanAntonioCheck.focus();
		return;
	}
});

// ================================================================
// handle contact form submit
// ================================================================

const contactForm = document.getElementById('contact__form');
const submitMsgBtn = document.getElementById('submitMsgBtn');

contactForm.addEventListener('submit', async function (e) {
	e.preventDefault();
	submitMsgBtn.disabled = true;
	// select form inputs

	const email = document.getElementById('email');
	email.addEventListener('submit', function (e) {
		e.preventDefault();
	});
	const sanAntonio = document.getElementById('sanAntonio');
	const boerne = document.getElementById('boerne');
	const message = document.getElementById('message');
	message.addEventListener('submit', function (e) {
		e.preventDefault();
	});
	// check do all inputs have a value?
	const inputsAreFilled = name.value && email.value && message.value;
	// const boxChecked = sanAntonio.checked || boerne.checked;
	let location;
	if (sanAntonio.checked && !boerne.checked) {
		location = 'San Antonio';
	} else if (boerne.checked && !sanAntonio.checked) {
		location = 'Boerne';
	} else {
		location = null;
	}

	// if all input fields in form are completed, do this
	if (inputsAreFilled && location) {
		const url = 'https://fit-email.herokuapp.com/api/sendemail';
		const options = {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			body: JSON.stringify({
				name: name.value,
				email: email.value,
				location: location,
				message: message.value,
			}),
		};

		name.value = null;
		email.value = null;
		sanAntonio.value = null;
		boerne.value = null;
		message.value = null;

		fetch(url, options).then((response) => {
			if (response.status === 200) {
				submitMsgBtn.disabled = false;
				alert('Your message has been sent!');
			} else if (response.status && response.status !== 200) {
				alert('Sorry, we were unable to send your message.');
			}
		});
	} else {
		// if form is not completed, do this
		alert('Your message could not be sent because not all of the fields in the form are completed.');
		submitMsgBtn.disabled = false;
	}
});
