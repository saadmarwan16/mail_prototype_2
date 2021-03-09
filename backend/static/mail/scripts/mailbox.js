// Load a mailbox
function load_mailbox(mailbox) {

	// Delete the contents of the previous view (if any)
	if (document.querySelector('.contents-container') != null) {
		const elem = document.querySelector('.contents-container');
		document.querySelector('#single-mail-view').removeChild(elem);
	}
  
	// Show the mailbox name
	document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

	// Show a spinner and hide other views
	document.querySelector('#compose-view').style.display = 'none';
	document.querySelector('#single-mail-view').style.display = 'none';
	document.querySelector('#spinner').style.display = 'flex';

	// Artificially wait for half a second and load mailbox
	loadMails(mailbox)
}