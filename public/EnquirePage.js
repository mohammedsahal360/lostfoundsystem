// EnquirePage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const EnquirePage = () => {
    const { itemName } = useParams(); // Get item name from URL parameters
    const [itemDetails, setItemDetails] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3002/api/item/${itemName}`); // Adjust the URL if necessary
                if (!response.ok) {
                    throw new Error('Item not found');
                }
                const data = await response.json();
                setItemDetails(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchItemDetails();
    }, [itemName]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!itemDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Item Details</h2>
            <p><strong>Name:</strong> {itemDetails.item_name}</p>
            <p><strong>Brand:</strong> {itemDetails.brand}</p>
            <p><strong>Color:</strong> {itemDetails.color}</p>
            <p><strong>Size:</strong> {itemDetails.size}</p>
            <p><strong>Material:</strong> {itemDetails.material}</p>
            <p><strong>Other Specifications:</strong> {itemDetails.other_specifications}</p>
            <p><strong>Status:</strong> {itemDetails.status}</p>
        </div>
    );
};

export default EnquirePage;
