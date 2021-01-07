const props = ['name', 'email', 'tel', 'address', 'icon'];
const opts = {multiple: true};
const supported = ('contacts' in navigator && 'ContactsManager' in window);

async function getContacts() {

    if (supported) {
        const contacts = await navigator.contacts.select(props, opts);
        console.log(contacts)
    }

}

const btn = document.getElementById('contacts');
btn.addEventListener('click', getContacts);

