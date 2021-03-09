// Creates icons for commands such as going back to mailbox
function createCommands(mailbox, email) {

    // Put all the icons inside an icons container
    let iconsContainer = document.createElement('div');
    iconsContainer.className = 'w3-padding w3-xlarge w3-text-blue single-mail-icons';

    // // Add a go back icon for users to be able to go back to inbox
    let back = createSingleCommand('Go back', 'west');
    iconsContainer.append(back);

    // Users can delete messages that have not been deleted already and vice versa
    if (mailbox === 'trash') {

        // // Add an undelete icon for deleting of current message
        var restore = createSingleCommand('Restore from trash', 'restore_from_trash');
        iconsContainer.append(restore);
    } else {

        // Add a delete icon for deleting of current message
        var deleteMail = createSingleCommand('Delete', 'delete');
        iconsContainer.append(deleteMail);
    }

    // Add a mark as unread icon to make this message unread
    let mailUnread = createSingleCommand('Mark as unread', 'mark_email_unread');
    iconsContainer.append(mailUnread);
    
    // Only append archive and unarchive options when the user is not the one who sent the email
    if (mailbox !== 'sent') {

        // Add an archived icon if the message is not archived otherwise unarchive icon
        if (email.archived === false) {
            
            // Add an archive icon to give users the option to archive current email
            var archive = createSingleCommand('Archive', 'archive');
            iconsContainer.append(archive);

        } else {
            
            // Add an unarchive icon to give users the option to unarchive the current email
            var unarchive = createSingleCommand('Unarchive', 'unarchive');
            iconsContainer.append(unarchive);
        }
    }

    // Put the icons container inside a row of it's own
    let commands = document.createElement('div');
    commands.className = 'row commands';
    commands.append(iconsContainer);

    iconsContainer.addEventListener('click', event => {

        // User clicks on the go back icon
        if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'west') {

            const elem = document.querySelector('.contents-container');
            document.querySelector('#single-mail-view').removeChild(elem);
            load_mailbox(mailbox);
        }

        // User clicks on the delete icon
        else if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'delete') {

            const elem = document.querySelector('.contents-container');
            document.querySelector('#single-mail-view').removeChild(elem);

            fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    trashed: true
                })
            })

            load_mailbox(mailbox);
        }

        // User clicks on the remove from trash icon
        else if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'restore_from_trash') {

            const elem = document.querySelector('.contents-container');
            document.querySelector('#single-mail-view').removeChild(elem);

            fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    trashed: false
                })
            })

            load_mailbox(mailbox);
        }
        
        // User clicks on the mark as unread icon
        else if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'mark_email_unread') {
            const elem = document.querySelector('.contents-container');
            document.querySelector('#single-mail-view').removeChild(elem);

            // Change the status of the message to unread
            fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    read: false
                })
            })

            load_mailbox(mailbox);
        }

        // User clicks on the archive icon
        else if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'archive') {

            // Send a PUT request to change a mail to archived
            fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: true
                })
            })

            // After the email has been archived send the user back to the inbox
            load_mailbox('inbox');
        }

        // User clicks on the unarchive icon
        else if (event.target.className === 'material-icons single-mail-icon-icon' && event.target.innerText === 'unarchive') {

            // Send a PUT request to change a mail to archived
            fetch(`/emails/${email.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: false
                })
            })

            // After the email has been archived send the user back to the inbox
            load_mailbox('inbox');
        }
    })

    return commands
}


// Creates the boiler plate code for each icon
function createSingleCommand(title, text) {
    let command = document.createElement('a');
    let commandIcon = document.createElement('i');
    command.className = 'single-mail-icon';
    command.title = title;
    commandIcon.innerText = text;
    commandIcon.className = 'material-icons single-mail-icon-icon';
    command.append(commandIcon);

    return command
}