document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const now = new Date();
    document.getElementById('previewDate').textContent = now.toLocaleDateString();
    
    // Initialize items array
    let items = [];
    
    // Load saved data if available
    loadSavedData();
    
    // Add item event
    document.getElementById('addItem').addEventListener('click', addItem);
    
    // Generate receipt event
    document.getElementById('generateReceipt').addEventListener('click', generateReceipt);
    
    // Print receipt event
    document.getElementById('printReceipt').addEventListener('click', printReceipt);
    
    // Clear all event
    document.getElementById('clearAll').addEventListener('click', clearAll);
    
    // Save template event
    document.getElementById('saveTemplate').addEventListener('click', saveTemplate);
    
    // Template selector events
    document.querySelectorAll('.template-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.template-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
            applyTemplate(this.dataset.template);
        });
    });
        
    // Enter key to add item
    document.getElementById('itemName').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addItem();
        }
    });
    
    // Auto-save when inputs change
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', saveData);
    });
    
    function addItem() {
        const name = document.getElementById('itemName').value.trim();
        const price = parseFloat(document.getElementById('itemPrice').value);
        const quantity = parseInt(document.getElementById('itemQuantity').value) || 1;
        
        if (!name || isNaN(price) || price <= 0) {
            alert('Please enter a valid item name and price');
            return;
        }
        
        const item = {
            id: Date.now(),
            name,
            price,
            quantity,
            total: price * quantity
        };
                
        items.push(item);
        updateItemsList();
        updateReceiptPreview();
        clearItemInputs();
        saveData();
    }
    
    function removeItem(id) {
        items = items.filter(item => item.id !== id);
        updateItemsList();
        updateReceiptPreview();
        saveData();
    }
    
    function updateItemsList() {
        const itemsList = document.getElementById('itemsList');
        
        if (items.length === 0) {
            itemsList.innerHTML = `
                <tr>
                    <td colspan="5" class="empty-state">
                        <div>No items added yet</div>
                    </td>
                </tr>
            `;
            return;
        }
                
        itemsList.innerHTML = items.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.quantity}</td>
                <td>$${item.total.toFixed(2)}</td>
                <td class="action-buttons">
                    <button class="btn btn-danger action-btn" onclick="removeItem(${item.id})">Remove</button>
                </td>
            </tr>
        `).join('');
    }
    
    function clearItemInputs() {
        document.getElementById('itemName').value = '';
        document.getElementById('itemPrice').value = '';
        document.getElementById('itemQuantity').value = '1';
        document.getElementById('itemName').focus();
    }
    
    function generateReceipt() {
        updateReceiptPreview();
    }