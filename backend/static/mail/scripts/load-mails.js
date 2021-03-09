function loadMails(mailbox) {

    // Make an API GET request to get the emails in this mailbox
    fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {

        // Hide other other views and show the mailbox
        document.querySelector('#spinner').style.display = 'none';
        document.querySelector('#single-mail-view').style.display = 'none';
        document.querySelector('#emails-view').style.display = 'block';

        // Create a mailbox
        let mailBox = document.createElement('div');
        mailBox.className = "list-group";

        // Add all the available mails to the mailbox
        emails.forEach(email => {

            // Create a mail
            let mail = document.createElement('a');

            // Unread emails should appear with a white background and read ones should appear with gray
            if (email.read === false) {
                mail.className = 'list-group-item list-group-item-action list-group-item-light mail-link';
            } else {
                mail.className = 'list-group-item list-group-item-action list-group-item-secondary mail-link';
            }

            // Add the name of the sender to the mail
            let sender = document.createElement('div');
            sender.className = 'sender';
            sender.innerText = email.sender;
            mail.append(sender);

            // Create a new class and give it a name
            let subjectBody = document.createElement('div');
            subjectBody.className = 'subject-body';

            // Add the subject to the mail
            let subject = document.createElement('span');
            subject.className = 'subject';
            subject.innerText = email.subject;

            // Add the body to the mail
            let body = document.createElement('span');
            body.className = 'body';
            body.innerText = email.body;
            
            // Add the subject and body to 'subject-body' and add 'subject-body' to the mail
            subjectBody.append(subject);
            subjectBody.append(body);
            mail.append(subjectBody);
            
            // Add a timestamp to the mail
            let timestampContainer = document.createElement('div');
            let timestamp = document.createElement('small');
            timestampContainer.className = `timestamp timestamp${email.id}`;
            timestamp.innerText = email.timestamp;
            timestampContainer.append(timestamp);
            mail.append(timestampContainer);

            // Add icons container to each mail
            let iconsContainer = document.createElement('div');
            iconsContainer.className = `w3-padding w3-xlarge w3-text-blue icons icons${email.id}`;
            mail.append(iconsContainer);

            // Add a delete icon
            let deleteMail = document.createElement('a');
            let deleteMailIcon = document.createElement('i');
            deleteMail.title = 'Delete';
            deleteMailIcon.innerText = 'delete';
            deleteMailIcon.className = 'material-icons';
            deleteMail.append(deleteMailIcon);
            iconsContainer.append(deleteMail);

            // Add a restore from trash icon
            let restore = document.createElement('a');
            let restoreIcon = document.createElement('i');
            restore.title = 'Restore from trash';
            restoreIcon.innerText = 'restore_from_trash';
            restoreIcon.className = 'material-icons';
            restore.append(restoreIcon);
            iconsContainer.append(restore);

            // Add an archive icon
            let archive = document.createElement('a');
            let archiveIcon = document.createElement('i');
            archive.title = 'Archive';
            archiveIcon.innerText = 'archive';
            archiveIcon.className = 'material-icons';
            archive.append(archiveIcon);
            iconsContainer.append(archive);

            // Add an unarchive icon
            let unarchive = document.createElement('a');
            let unarchiveIcon = document.createElement('i');
            unarchive.title = 'Unarchive';
            unarchiveIcon.innerText = 'unarchive';
            unarchiveIcon.className = 'material-icons';
            unarchive.append(unarchiveIcon);
            iconsContainer.append(unarchive);

            // Add a mark as read icon
            let mailRead = document.createElement('a');
            let mailReadIcon = document.createElement('i');
            mailRead.title = 'Mark as read';
            mailReadIcon.innerText = 'mark_email_read';
            mailReadIcon.className = 'material-icons';
            mailRead.append(mailReadIcon);
            iconsContainer.append(mailRead);

            // Add a mark as unread icon
            let mailUnread = document.createElement('a');
            let mailUnreadIcon = document.createElement('i');
            mailUnread.title = 'Mark as unread';
            mailUnreadIcon.innerText = 'mark_email_unread';
            mailUnreadIcon.className = 'material-icons';
            mailUnread.append(mailUnreadIcon);
            iconsContainer.append(mailUnread);

            // Users cannot archive emials they sent themselves
            if (mailbox === 'sent') {
                unarchive.style.display = 'none';
                archive.style.display = 'none';
            } else {

                // Add an archive icon if the message is unarchived else add an unarchive icon
                if (email.archived === false) {

                    unarchive.style.display = 'none';
                    archive.style.display = 'block';
                } else {

                    archive.style.display = 'none';
                    unarchive.style.display = 'block';
                }
            }

            // Add a mark as read icon if the mail is not read else add a mark as a mark as read icon
            if (email.read === false) {

                mailUnread.style.display = 'none';
                mailRead.style.display = 'block';
            } else {

                mailRead.style.display = 'none';
                mailUnread.style.display = 'block';
            }

            // Add a restore icon if the email is in the trash, otherwise add a delete icon
            if (mailbox === 'trash') {
                deleteMail.style.display = 'none';
                restore.style.display = 'block';
            } else {
                restore.style.display = 'none';
                deleteMail.style.display = 'block';
            }

            // If user moves mouse over this email, hide timestamp and show command icons
            mail.addEventListener('mouseover', () => {
                document.querySelector(`.timestamp${email.id}`).style.display = 'none';
                document.querySelector(`.icons${email.id}`).style.display = 'flex';
            })

            // If user moves mouse out of this email, hide command icons and show timestamp
            mail.addEventListener('mouseout', () => {
                document.querySelector(`.icons${email.id}`).style.display = 'none';
                document.querySelector(`.timestamp${email.id}`).style.display = 'block';
            })

            // Response to clicks on different parts of the mail
            mail.addEventListener('click', event => {

                // User clicks on the delete icon
                if (event.target.className === 'material-icons' && event.target.innerText === 'delete') {

                    // Animate the mail and then remove it from the DOM
                    mail.style.animationPlayState = 'running';
                    mail.addEventListener('animationend', () =>  {
                        mail.remove();
                    });

                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            trashed: true
                        })
                    })
                }

                // User clicks on the restore from trash icon
                else if (event.target.className === 'material-icons' && event.target.innerText === 'restore_from_trash') {

                    // Animate the mail and then remove it from the DOM
                    mail.style.animationPlayState = 'running';
                    mail.addEventListener('animationend', () =>  {
                        mail.remove();
                    });

                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            trashed: false
                        })
                    })
                }
                
                // User clicks on the archive icon
                else if (event.target.className === 'material-icons' && event.target.innerText === 'archive') {

                    // Animate the mail and then remove it from the inbox DOM view
                    mail.style.animationPlayState = 'running';
                    mail.addEventListener('animationend', () =>  {
                        mail.remove();
                    });

                    // Send a PUT request to change a mail to archived
                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            archived: true
                        })
                    })
                }
                
                // User clicks on the unarchive icon
                else if(event.target.className === 'material-icons' && event.target.innerText === 'unarchive') {

                    // Animate the mail and then remove it from the archive DOM view
                    mail.style.animationPlayState = 'running';
                    mail.addEventListener('animationend', () =>  {
                        mail.remove();
                    });

                    // Send a PUT request to change a mail to unarchived
                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            archived: false
                        })
                    })
                }
                
                // User clicks on the mark as read icon
                else if (event.target.className === 'material-icons' && event.target.innerText === 'mark_email_read') {

                    mailRead.style.display = 'none';
                    mailUnread.style.display = 'block';
                    mail.classList.remove('list-group-item-light');
                    mail.classList.add('list-group-item-secondary');

                    // Change the status of the message to unread
                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: true
                        })
                    })
                }
                
                // User clicks on the mark as unread icon
                else if (event.target.className === 'material-icons' && event.target.innerText === 'mark_email_unread') {

                    mailUnread.style.display = 'none';
                    mailRead.style.display = 'block';
                    mail.classList.remove('list-group-item-secondary');
                    mail.classList.add('list-group-item-light');

                    // Change the status of the message to unread
                    fetch(`/emails/${email.id}`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            read: false
                        })
                    })
                } 
                
                // User clicks on the mail
                else {
                    loadSingleMail(email.id, mailbox);
                }
            })

            // Add this mail to the mailbox
            mailBox.append(mail);
        })

        document.querySelector('#emails-view').append(mailBox);
    })
}