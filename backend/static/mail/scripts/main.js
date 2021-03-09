document.addEventListener('DOMContentLoaded', function() {

	// Use buttons to toggle between views
	document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
	document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
    document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
    document.querySelector('#trashed').addEventListener('click', () => load_mailbox('trash'));
    document.querySelector('#compose').addEventListener('click', compose_email);

    // Listen to clicks on the submit button and attempt to send email(s)
	document.querySelector('#submit-btn').addEventListener('click', event => {

		// Send the email, prevent the form from loading and load the sent mailbox
        send_email(event);
		load_mailbox('sent');
	})

    // By default, load the inbox
	load_mailbox('inbox');
})