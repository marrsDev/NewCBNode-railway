// public/js/app.js - Fixed version

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded');
    
    // Initialize variables
    let cost = 0; // ADD THIS LINE - cost variable was missing
    
    // Add event listener to calculate button
    const calculateButton = document.querySelector('.startButton');
    if (calculateButton) {
        calculateButton.addEventListener('click', calculateCost);
        console.log('Calculate button event listener added');
    } else {
        console.error('Calculate button not found');
    }
    
    // Add event listener to add to cart button
    const addToCartButton = document.getElementById('add-to-cart');
    if (addToCartButton) {
        addToCartButton.addEventListener('click', addToCart);
    }
    
    // Add event listeners for preview updates
    document.getElementById('noOfPanels').addEventListener('change', updatePreview);
    document.getElementById('fixedPartition').addEventListener('change', updatePreview);
    document.getElementById('profileColour').addEventListener('change', updateProfileConfig);
    
    async function calculateCost() {
        console.log('Calculate cost button clicked');
        
        // Get values from form
        const height = parseInt(document.getElementById('heightId').value);
        const width = parseInt(document.getElementById('widthId').value);
        const profileColour = document.getElementById('profileColour').value;
        const noOfPanels = document.getElementById('noOfPanels').value;
        const fixedPartition = document.getElementById('fixedPartition').value;
        const glassType = document.getElementById('glassType').value;
        const glassThickness = document.getElementById('glassThickness').value;
        
        // Validate inputs
        if (!height || !width || height <= 0 || width <= 0) {
            alert('Please enter valid height and width values');
            return;
        }
        
        console.log('Sending request to server with data:', {
            height, width, profileColour, noOfPanels, fixedPartition, glassType, glassThickness
        });
        
        try {
            // Prepare data for API
            const requestData = {
                height,
                width,
                noOfPanels,
                fixedPartition,
                glassType,
                glassThickness,
                profileColour
            };
            
            // Send request to backend
            const response = await fetch('/api/calculations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Response data:', data);
            
            // Check if the response has the expected structure
            if (data.success && data.totalCost !== undefined) {
                cost = data.totalCost;
                document.getElementById('cost').value = `KSh ${cost.toLocaleString()}`;
                
                // Store the calculation data for adding to cart
                window.lastCalculation = {
                    ...requestData,
                    cost: data.totalCost,
                    breakdown: data.breakdown
                };
            } else if (data.cost !== undefined) {
                // Fallback: if cost is directly in data
                cost = data.cost;
                document.getElementById('cost').value = `KSh ${cost.toLocaleString()}`;
                
                // Store the calculation data for adding to cart
                window.lastCalculation = {
                    ...requestData,
                    cost: data.cost,
                    breakdown: data.breakdown || {}
                };
            } else {
                throw new Error('Invalid response format from server');
            }
            
        } catch (error) {
            console.error('Error calculating cost:', error);
            alert('Error calculating cost. Please try again.');
        }
    }
    
    async function addToCart() {
        console.log('Add to cart clicked');
        
        if (!window.lastCalculation || !window.lastCalculation.cost) {
            alert('Please calculate cost first before adding to cart');
            return;
        }
        
        try {
            const success = await cartManager.addToCart(window.lastCalculation);
            
            if (success) {
                alert('Item added to cart!');
            } else {
                alert('Failed to add item to cart. Please try again.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Error adding to cart. Please try again.');
        }
    }
    
    function updatePreview() {
        console.log('Updating preview');
        
        // Get values from form
        const noOfPanels = document.getElementById('noOfPanels').value;
        const fixedPartition = document.getElementById('fixedPartition').value;
        
        // Determine image based on selections
        let imageName = 'type-1'; // default
        
        if (noOfPanels === '2') {
            if (fixedPartition === 'noPartition') imageName = 'type-1';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-5';
            else if (fixedPartition === 'fixedTop') imageName = 'type-3';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-3';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-10';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        } else if (noOfPanels === '3') {
            if (fixedPartition === 'noPartition') imageName = 'type-2';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-6';
            else if (fixedPartition === 'fixedTop') imageName = 'type-4';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-4';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-11';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        } else if (noOfPanels === '4') {
            if (fixedPartition === 'noPartition') imageName = 'type-69';
            else if (fixedPartition === 'doubleFixed') imageName = 'type-69';
            else if (fixedPartition === 'fixedTop') imageName = 'type-69';
            else if (fixedPartition === 'fixedBottom') imageName = 'type-69';
            else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-69';
            else if (fixedPartition === 'openAbleTop') imageName = 'type-69';
        }
        
        // Update image and type code
        document.getElementById('img-type').src = `img/previewLabels/${imageName}.png`;
        document.getElementById('type-code').textContent = `#${imageName}`;
    }

    function updateProfileConfig() {
        console.log('Profile color changed');
        const profileColour = document.getElementById('profileColour').value;
        console.log('Selected profile color:', profileColour);
    }
    
    window.toggleMenu = function() {
        const menu = document.querySelector('.menu');
        menu.classList.toggle('active');
    };
});

// Add these functions to your vanilla JavaScript app.js
function updatePreview() {
    console.log('Updating preview');
    
    // Get values from form
    const noOfPanels = document.getElementById('noOfPanels').value;
    const fixedPartition = document.getElementById('fixedPartition').value;
    
    // Determine image based on selections
    let imageName = 'type-1'; // default
    
    if (noOfPanels === '2') {
        if (fixedPartition === 'noPartition') imageName = 'type-1';
        else if (fixedPartition === 'doubleFixed') imageName = 'type-2';
        else if (fixedPartition === 'fixedTop') imageName = 'type-3';
        else if (fixedPartition === 'fixedBottom') imageName = 'type-4';
        else if (fixedPartition === 'openAbleTopFxBtm') imageName = 'type-5';
        else if (fixedPartition === 'openAbleTop') imageName = 'type-6';
    } else if (noOfPanels === '3') {
        imageName = 'type-3-panel';
    } else if (noOfPanels === '4') {
        imageName = 'type-4-panel';
    }
    
    // Update image and type code
    document.getElementById('img-type').src = `img/${imageName}.png`;
    document.getElementById('type-code').textContent = `#${imageName}`;
}

function updateProfileConfig() {
    console.log('Profile color changed');
    const profileColour = document.getElementById('profileColour').value;
    console.log('Selected profile color:', profileColour);
}

// Make sure these functions are available globally
window.updatePreview = updatePreview;
window.updateProfileConfig = updateProfileConfig;
console.log('app.js loaded successfully');