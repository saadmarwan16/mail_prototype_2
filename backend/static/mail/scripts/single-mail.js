// Displays an email once it is clicked from a mailbox
function loadSingleMail(id, mailbox) {

    // Hide the emails views and show a spinner
	document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#spinner').style.display = 'flex';
    
    // Send a GET request to get information about this current email
    fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
        
        // Hide the spinner and show the email
        document.querySelector('#spinner').style.display = 'none';
        document.querySelector('#single-mail-view').style.display = 'block';

        // After the email finish loading, mark it as read if it has not been read before
        if (!email.read) {
            fetch(`/emails/${id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    read: true
                })
            })
        }

        let commands = createCommands(mailbox, email);

        // Add the subject of the message to the DOM in a row of it's own
        let subjectContainer = document.createElement('div');
        let subject = document.createElement('h2');
        subjectContainer.className = 'row single-mail-subject';
        subject.innerText = email.subject;
        subjectContainer.append(subject);

        // Add the name of the sender to the DOM
        let sender = document.createElement('div');
        sender.className = 'single-mail-sender';
        sender.innerText = `Sender: ${email.sender}`;

        // Add the names of the recipient(s) to the DOM
        let recipients = document.createElement('div');
        recipients.className = 'single-mail-recipients';
        recipients.innerText = `Recipient(s): ${email.recipients}`;
        
        // Add a timestamp to the DOM
        let timestampContainer = document.createElement('div');
        let timestamp = document.createElement('small');
        timestampContainer.className = 'single-mail-timestamp';
        timestamp.innerText = `Timestamp: ${email.timestamp}`;
        timestampContainer.append(timestamp);

        // Add a reply icon to give users the option of replying to the message
        let reply = document.createElement('a');
        let replyIcon = document.createElement('i');
        reply.title = 'Reply';
        replyIcon.innerText = 'reply';
        reply.className = 'single-mail-icon reply-icon-container';
        replyIcon.className = 'material-icons single-mail-icon-icon';
        reply.append(replyIcon);

        // User clicks on the reply icon
        reply.addEventListener('click', () => {
            compose_email(email.sender, email.subject, email.timestamp, email.body);
        })

        // Put the person icon, sender, timestamp and reply icon into a container in a row
        let content = document.createElement('div');
        content.className = 'row content';
        content.append(sender);
        content.append(recipients);
        content.append(timestampContainer);
        content.append(reply);

        // Add the body of the email into a container in a row
        let body = document.createElement('div');
        body.className = 'row main-body jumbotron';
        let bodyContent = document.createElement('p');
        bodyContent.className = 'main-body-content';
        bodyContent.innerText = email.body;
        body.append(bodyContent);

        // Add all the contents into a container and put it in the single-mail-view
        let singleMail = document.querySelector('#single-mail-view');
        let contentsContainer = document.createElement('div');
        contentsContainer.className = 'contents-container';
        contentsContainer.append(commands);
        contentsContainer.append(subjectContainer);
        contentsContainer.append(content);
        contentsContainer.append(body);
        singleMail.append(contentsContainer);
    })
}