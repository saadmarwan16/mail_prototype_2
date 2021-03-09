function compose_email(recipient=null, subject=null, timestamp=null, body=null) {

	// Show compose view and hide other views
	document.querySelector('#emails-view').style.display = 'none';
	document.querySelector('#single-mail-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'block';
    
    emailRecipient = document.querySelector('#compose-recipients');
    emailSubject = document.querySelector('#compose-subject');
    emailBody = document.querySelector('#compose-body');

    // User either trying to compose a new email or is trying to replying to an existing mail
	if (recipient !== null && subject !== null) {

        // Prefill the subject and the recipient with the one who sent the email
		emailRecipient.disabled = true;
		emailSubject.disabled = true;
		emailRecipient.value = recipient;
		emailSubject.value = `Re: ${subject}`;
		emailBody.value = `On ${timestamp} ${recipient} wrote: ${body}`;
	} else {

		// Clear out composition fields for new mail
		emailRecipient.disabled = false;
		emailSubject.disabled = false;
		emailRecipient.value = '';
		emailSubject.value = '';
		emailBody.value = '';
	}
}

function send_email(event) {

    // Send an API POST request to insert the data into the database
    fetch('/emails', {
        method: 'POST',
        body: JSON.stringify ({
            recipients: document.querySelector('#compose-recipients').value,
            subject: document.querySelector('#compose-subject').value,
            body: document.querySelector('#compose-body').value
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);    // DO SOMETHING
    })

    // Once the email has been sent, prevent the DOM from reloading and then load the user’s sent mailbox.
    event.preventDefault();
    load_mailbox('sent');
}