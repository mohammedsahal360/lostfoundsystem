document.addEventListener('DOMContentLoaded', () => {
    const itemNameElement = document.getElementById('item-name');
    const brandSelect = document.getElementById('brand');
    const materialSelect = document.getElementById('material');
    const enquiryForm = document.getElementById('enquiryForm');

    // Predefined sets of brands based on item types
    const brands = {
        "Watch": ["Titan", "Rolex", "Casio", "Fossil", "Seiko", "Michael Kors", "Bulova", "Timex", "Citizen", "Omega"],
        "Bag": ["Nike", "Addidas", "Puma", "Fjällräven", "The North Face", "Herschel", "Eastpak", "Under Armour", "Vans", "Osprey"],
        "Wallet": ["Levi's", "Cross", "Tommy Hilfiger", "Gucci", "Calvin Klein", "Zara", "Fossil", "Ray-Ban", "Bellroy", "Tumi"],
        "Water Bottle": ["Contigo", "Nalgene", "Hydro Flask", "CamelBak", "S'well", "Klean Kanteen", "ThermoFlask", "Zojirushi", "YETI", "Bubba"],
        "Umbrella": ["Poppy", "Totes", "Senz", "GustBuster", "Blunt", "Fulton", "Samsonite", "Davek", "Nike"],
        "Backpack": ["Osprey", "The North Face", "Deuter", "Patagonia", "Herschel", "JanSport", "Nike", "Addidas", "SwissGear", "Columbia"]
    };

    // Function to get URL parameters
    function getUrlParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Get the item name from the URL
    const itemNameFromUrl = getUrlParameter('item');

    if (itemNameFromUrl) {
        itemNameElement.textContent = itemNameFromUrl;

        // Populate brand and material options based on the selected item
        fetchBrandsAndMaterials(itemNameFromUrl);
    } else {
        console.error('No item name provided in the URL.');
    }

    function fetchBrandsAndMaterials(itemName) {
        // Fetch the brands based on the item type
        const itemType = determineItemType(itemName); // Create a function to determine the item type
        console.log(`Determined item type for "${itemName}": ${itemType}`); // Debugging log

        if (itemType) {
            const availableBrands = brands[itemType];
            populateBrandOptions(availableBrands);
        } else {
            console.error(`Item type for "${itemName}" is not recognized.`);
        }

        // Fetch materials from your API (you can adjust this if needed)
        fetch('/api/materials')
            .then(response => response.json())
            .then(data => {
                materialSelect.innerHTML = data.map(material => `<option value="${material.material}">${material.material}</option>`).join('');
            })
            .catch(error => console.error('Error fetching materials:', error));
    }

    function determineItemType(itemName) {
        // Example logic to determine item type based on the item name
        if (itemName.toLowerCase().includes('watch')) return 'Watch';
        if (itemName.toLowerCase().includes('bag')) return 'Bag';
        if (itemName.toLowerCase().includes('wallet')) return 'Wallet';
        if (itemName.toLowerCase().includes('bottle')) return 'Water Bottle';
        if (itemName.toLowerCase().includes('umbrella')) return 'Umbrella';
        if (itemName.toLowerCase().includes('backpack')) return 'Backpack'; // Added for Backpack
        return null; // If the item type is not recognized
    }

    function populateBrandOptions(availableBrands) {
        brandSelect.innerHTML = ''; // Clear existing options
        availableBrands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option); // Add each fetched brand as an option
        });
    }

    enquiryForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const selectedBrand = brandSelect.value;
        const selectedMaterial = materialSelect.value;
        const itemName = itemNameElement.textContent;

        // Fetch the item details from the server to verify ownership
        fetch(`/api/item/${itemName}`)
            .then(response => response.json())
            .then(item => {
                // Check if the selected brand and material match the fetched item details
                if (item && item.brand === selectedBrand && item.material === selectedMaterial) {
                    alert('Owner is verified!');
                    displayVerificationMessage('Owner is verified!', 'success');
                } else {
                    alert('Owner not verified. Please check the details.');
                    displayVerificationMessage('Owner not verified. Please check the details.', 'danger');
                }
            })
            .catch(error => console.error('Error fetching item for verification:', error));
    });

    // Function to display a verification message on the webpage
    function displayVerificationMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type}`;
        messageDiv.textContent = message;
        document.body.appendChild(messageDiv); // Add the message to the page
    }
});
