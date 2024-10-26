function listopen() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropbtn = document.getElementById('dropdown-toggle');

    // Toggle the display of the dropdown
    if (dropdownMenu.style.display === 'block') {
        dropdownMenu.style.display = 'none';
        dropbtn.innerHTML = '&#9776;'; // Change back to hamburger icon
    } else {
        dropdownMenu.style.display = 'block';
        dropbtn.innerHTML = '&#10006;'; // Change to cross icon
    }
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        const dropbtn = document.getElementById('dropdown-toggle');

        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.style.display === 'block') {
                openDropdown.style.display = 'none';
                dropbtn.innerHTML = '&#9776;'; // Change back to hamburger icon
            }
        }
    }
}

// script.js

// Function to fetch users
async function fetchUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        console.log(users); // You can process or display this data
    } catch (error) {
        console.error('Error fetching users:', error);
    }
}

// Function to fetch items
async function fetchItems() {
    try {
        const response = await fetch('/api/items');
        const items = await response.json();
        displayItems(items); // Call function to display items
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Function to display items
function displayItems(items) {
    const foundItemsContainer = document.querySelector('.founditems .itemcontainer');
    const lostItemsContainer = document.querySelector('.lostitems .itemcontainer');

    // Clear existing items
    foundItemsContainer.innerHTML = '';
    lostItemsContainer.innerHTML = '';

    items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('item');
        itemElement.innerHTML = `
            <h5><b>${item.item_name}</b></h5>
            <h5>Color: ${item.color}</h5>
            <h5>Size: ${item.size}</h5>
            <a href="enquire.html?item=${item.item_name}">Enquire</a>
        `;
        console.log(`item: ${item.item_name}`)
        if (item.status === 'found') {
            foundItemsContainer.appendChild(itemElement);
        } else {
            lostItemsContainer.appendChild(itemElement);
        }
    });
}

// Call the functions on page load
window.onload = function() {
    fetchUsers();
    fetchItems();
};


 // Handle form submission
 document.getElementById('uploadForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    const itemName = document.getElementById('itemName').value;
    const itemColour = document.getElementById('itemColour').value;
    const itemBrand = document.getElementById('brand').value;
    const itemSize = document.getElementById('itemSize').value;
    const itemMaterial = document.getElementById('itemMaterial').value;
    const itemothers = document.getElementById('others').value;

    const itemData = {
        name: itemName,
        colour: itemColour,
        brand: itemBrand,
        size: itemSize,
        material: itemMaterial,
        status: 'found', // Assuming all items uploaded here are found items
        others: itemothers,
        returned: 0
    };

    try {
        const response = await fetch('/api/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(itemData)
        });

        if (response.ok) {
            alert('Item successfully uploaded!');
            document.getElementById('uploadForm').reset(); // Reset the form
        } else {
            alert('Failed to upload item. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
});

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('login-message');
    const loginLink = document.getElementById('login-link');

    // Hardcoded credentials (for demonstration purposes only)
    const hardcodedUserId = 'user123';
    const hardcodedPassword = 'pass123';

    loginForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        const user_id = document.getElementById('user_id').value;
        const password = document.getElementById('password').value;

        // Client-side validation
        if (user_id === hardcodedUserId && password === hardcodedPassword) {
            sessionStorage.setItem('loggedIn', 'true');
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.addEventListener('click', () => {
                sessionStorage.removeItem('loggedIn');
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
            });
            window.location.href = 'index.html';
        } else {
            loginMessage.style.display = 'block';
            loginMessage.textContent = 'Invalid credentials. Please try again.';
        }
    });

    if (sessionStorage.getItem('loggedIn')) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', () => {
            sessionStorage.removeItem('loggedIn');
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
        });
    }
});