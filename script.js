// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    // Definições de constantes de Admin (para simplicidade, hardcoded)
    const ADMIN_USER = 'm123';
    const ADMIN_PASS = 'm12345';
    let isAdminLoggedIn = false;

    // Elementos do DOM - Modais
    const ticketModal = document.getElementById('ticketModal');
    const productModal = document.getElementById('productModal');
    const customerModal = document.getElementById('customerModal');
    const eventModal = document.getElementById('eventModal');
    const adminLoginModal = document.getElementById('adminLoginModal');

    // Elementos do DOM - Botões de fechar modais
    const closeTicketModalBtn = document.getElementById('closeTicketModalBtn');
    const closeProductModalBtn = document.getElementById('closeProductModalBtn');
    const closeCustomerModalBtn = document.getElementById('closeCustomerModalBtn');
    const closeEventModalBtn = document.getElementById('closeEventModalBtn');
    const closeAdminLoginModalBtn = document.getElementById('closeAdminLoginModalBtn');
    
    // Elementos do DOM - Navegação
    const navButtons = document.querySelectorAll('.nav-btn');
    const views = document.querySelectorAll('.view');

    // Elementos do DOM - PDV (Comanda)
    const openNewTicketBtn = document.getElementById('openNewTicketBtn');
    const ticketsGrid = document.getElementById('ticketsGrid');
    const ticketModalTitle = document.getElementById('ticketModalTitle');
    const editingTicketIdInput = document.getElementById('editingTicketId');
    const ticketCustomerSelect = document.getElementById('ticketCustomer');
    const ticketNewCustomerBtn = document.getElementById('ticketNewCustomerBtn');
    const ticketColorInput = document.getElementById('ticketColor');
    const ticketItemsContainer = document.getElementById('ticketItemsContainer');
    const ticketTotalValue = document.getElementById('ticketTotalValue');
    const saveTicketBtn = document.getElementById('saveTicketBtn');
    const closeAndPayTicketBtn = document.getElementById('closeAndPayTicketBtn');
    const sendTicketWhatsAppBtn = document.getElementById('sendTicketWhatsAppBtn');
    const generatePdfReceiptBtn = document.getElementById('generatePdfReceiptBtn');
    const deleteTicketBtn = document.getElementById('deleteTicketBtn');
    const paymentSection = document.getElementById('paymentSection');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const trocoSection = document.getElementById('trocoSection');
    const valorRecebidoInput = document.getElementById('valorRecebido');
    const valorTroco = document.getElementById('valorTroco');
    const finalizePaymentBtn = document.getElementById('finalizePaymentBtn');

    // Elementos do DOM - Grade de Seleção de Produtos (NOVO)
    const productSelectionGrid = document.getElementById('productSelectionGrid');
    const productGridSearchInput = document.getElementById('productGridSearchInput');
    const productGridCategoryFilter = document.getElementById('productGridCategoryFilter');


    // Elementos do DOM - Produtos (Gerenciamento)
    const showAddProductModalBtn = document.getElementById('showAddProductModalBtn');
    const productsTableBody = document.getElementById('productsTable').querySelector('tbody');
    const productSearchInput = document.getElementById('productSearchInput'); // Busca da tabela de gerenciamento
    const productModalTitle = document.getElementById('productModalTitle');
    const editingProductIdInput = document.getElementById('editingProductId');
    const productNameInput = document.getElementById('productName');
    const productCategorySelect = document.getElementById('productCategory');
    const productPriceInput = document.getElementById('productPrice');
    const productCostInput = document.getElementById('productCost');
    const saveProductBtn = document.getElementById('saveProductBtn');

    // Elementos do DOM - Clientes
    const showAddCustomerModalBtn = document.getElementById('showAddCustomerModalBtn');
    const customersTableBody = document.getElementById('customersTable').querySelector('tbody');
    const customerSearchInput = document.getElementById('customerSearchInput');
    const customerModalTitle = document.getElementById('customerModalTitle');
    const editingCustomerIdInput = document.getElementById('editingCustomerId');
    const customerNameInput = document.getElementById('customerName');
    const customerPhoneInput = document.getElementById('customerPhone');
    const customerConvenioCheckbox = document.getElementById('customerConvenio');
    const saveCustomerBtn = document.getElementById('saveCustomerBtn');
    
    // Elementos do DOM - Eventos
    const showAddEventModalBtn = document.getElementById('showAddEventModalBtn');
    const eventsListContainer = document.getElementById('eventsList');
    const eventModalTitle = document.getElementById('eventModalTitle');
    const editingEventIdInput = document.getElementById('editingEventId');
    const eventDateInput = document.getElementById('eventDate');
    const eventDescriptionInput = document.getElementById('eventDescription');
    const eventLiveMusicCheckbox = document.getElementById('eventLiveMusic');
    const saveEventBtn = document.getElementById('saveEventBtn');

    // Elementos do DOM - Relatórios
    const totalSalesValue = document.getElementById('totalSalesValue');
    const totalTicketsClosed = document.getElementById('totalTicketsClosed');
    const totalProfitValue = document.getElementById('totalProfitValue');
    const reportStartDateInput = document.getElementById('reportStartDate');
    const reportEndDateInput = document.getElementById('reportEndDate');
    const generateReportBtn = document.getElementById('generateReportBtn');
    const topProductsTableBody = document.getElementById('topProductsTable').querySelector('tbody');
    const topCustomersTableBody = document.getElementById('topCustomersTable').querySelector('tbody');
    const salesByDayTableBody = document.getElementById('salesByDayTable').querySelector('tbody');
    const exportTopProductsCsvBtn = document.getElementById('exportTopProductsCsvBtn');
    const exportTopCustomersCsvBtn = document.getElementById('exportTopCustomersCsvBtn');
    const exportSalesByDayCsvBtn = document.getElementById('exportSalesByDayCsvBtn');


    // Elementos do DOM - Configurações
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    const fixedCostsInput = document.getElementById('fixedCostsInput');
    const saveFixedCostsBtn = document.getElementById('saveFixedCostsBtn');
    const exportDataBtn = document.getElementById('exportDataBtn');
    const importDataFile = document.getElementById('importDataFile');
    const adminUserEl = document.getElementById('adminUser');
    const adminPassEl = document.getElementById('adminPass');
    const performAdminLoginBtn = document.getElementById('performAdminLoginBtn');
    const adminLoginError = document.getElementById('adminLoginError');

    // Estado da Aplicação (armazenado em LocalStorage)
    let products = loadData('products') || [];
    let customers = loadData('customers') || [];
    let tickets = loadData('tickets') || [];
    let events = loadData('events') || [];
    let settings = loadData('settings') || { fixedCosts: 0, theme: 'theme-dark' };

    let currentTicketItems = []; // Itens da comanda sendo editada/criada

    // --- INICIALIZAÇÃO ---
    function initApp() {
        applyTheme(settings.theme);
        loadFixedCosts();
        renderAll(); 
        setupEventListeners();
        checkAdminStatus(); 
        setDefaultReportDates();
    }

    function renderAll() {
        renderProducts(); // Para a tabela de gerenciamento de produtos
        renderCustomers();
        renderTicketsGrid();
        populateCustomerSelects();
        populateProductCategoriesFilter(); // Para o filtro da grade de produtos no modal
        renderProductSelectionGrid(); // Para a grade de produtos no modal
        renderEvents();
    }
    
    function setDefaultReportDates() {
        const today = new Date().toISOString().split('T')[0];
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
        if (reportStartDateInput) reportStartDateInput.value = firstDayOfMonth;
        if (reportEndDateInput) reportEndDateInput.value = today;
    }

    // --- PERSISTÊNCIA DE DADOS (LocalStorage) ---
    function saveData(key, data) {
        localStorage.setItem(`arenaBarPDV_${key}`, JSON.stringify(data));
    }

    function loadData(key) {
        const data = localStorage.getItem(`arenaBarPDV_${key}`);
        return data ? JSON.parse(data) : null;
    }

    // --- LÓGICA DE NAVEGAÇÃO E MODAIS ---
    function setupEventListeners() {
        // Navegação principal
        navButtons.forEach(button => {
            button.addEventListener('click', () => {
                if (button.classList.contains('admin-only') && !isAdminLoggedIn) {
                    showModal(adminLoginModal);
                    return;
                }
                showView(button.dataset.target);
                navButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });

        // Fechar modais
        [closeTicketModalBtn, closeProductModalBtn, closeCustomerModalBtn, closeEventModalBtn, closeAdminLoginModalBtn].forEach(btn => {
            if (btn) btn.addEventListener('click', () => hideModal(btn.closest('.modal')));
        });
        window.addEventListener('click', (event) => { 
            if (event.target.classList.contains('modal')) {
                hideModal(event.target);
            }
        });

        // PDV (Comanda)
        if (openNewTicketBtn) openNewTicketBtn.addEventListener('click', handleOpenNewTicketModal);
        if (saveTicketBtn) saveTicketBtn.addEventListener('click', handleSaveTicket);
        if (ticketItemsContainer) ticketItemsContainer.addEventListener('click', handleRemoveOrUpdateTicketItem);
        if (closeAndPayTicketBtn) closeAndPayTicketBtn.addEventListener('click', handleCloseAndPayTicket);
        if (paymentMethodSelect) paymentMethodSelect.addEventListener('change', handlePaymentMethodChange);
        if (valorRecebidoInput) valorRecebidoInput.addEventListener('input', calculateTroco);
        if (finalizePaymentBtn) finalizePaymentBtn.addEventListener('click', handleFinalizePayment);
        if (sendTicketWhatsAppBtn) sendTicketWhatsAppBtn.addEventListener('click', handleSendTicketWhatsApp);
        if (generatePdfReceiptBtn) generatePdfReceiptBtn.addEventListener('click', handleGeneratePdfReceipt);
        if (deleteTicketBtn) deleteTicketBtn.addEventListener('click', handleDeleteTicket);
        if (ticketNewCustomerBtn) ticketNewCustomerBtn.addEventListener('click', () => {
            hideModal(ticketModal);
            handleOpenNewCustomerModal(true); 
        });

        // Grade de Seleção de Produtos (NOVO)
        if (productSelectionGrid) productSelectionGrid.addEventListener('click', handleProductGridClick);
        if (productGridSearchInput) productGridSearchInput.addEventListener('input', filterProductsInGrid);
        if (productGridCategoryFilter) productGridCategoryFilter.addEventListener('change', filterProductsInGrid);


        // Produtos (Gerenciamento)
        if (showAddProductModalBtn) showAddProductModalBtn.addEventListener('click', handleOpenNewProductModal);
        if (saveProductBtn) saveProductBtn.addEventListener('click', handleSaveProduct);
        if (productSearchInput) productSearchInput.addEventListener('input', () => renderProducts(productSearchInput.value));


        // Clientes
        if (showAddCustomerModalBtn) showAddCustomerModalBtn.addEventListener('click', () => handleOpenNewCustomerModal(false));
        if (saveCustomerBtn) saveCustomerBtn.addEventListener('click', handleSaveCustomer);
        if (customerSearchInput) customerSearchInput.addEventListener('input', () => renderCustomers(customerSearchInput.value));
        
        // Eventos
        if (showAddEventModalBtn) showAddEventModalBtn.addEventListener('click', handleOpenNewEventModal);
        if (saveEventBtn) saveEventBtn.addEventListener('click', handleSaveEvent);

        // Configurações
        if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
        if (adminLoginBtn) adminLoginBtn.addEventListener('click', () => {
            if (!isAdminLoggedIn) showModal(adminLoginModal);
            else showView('reportsView'); 
        });
        if (adminLogoutBtn) adminLogoutBtn.addEventListener('click', handleAdminLogout);
        if (performAdminLoginBtn) performAdminLoginBtn.addEventListener('click', handleAdminLogin);
        if (saveFixedCostsBtn) saveFixedCostsBtn.addEventListener('click', saveFixedCosts);
        if (exportDataBtn) exportDataBtn.addEventListener('click', exportAllData);
        if (importDataFile) importDataFile.addEventListener('change', importAllData);
        
        // Relatórios
        if (generateReportBtn) generateReportBtn.addEventListener('click', generateAllReports);
        if (exportTopProductsCsvBtn) exportTopProductsCsvBtn.addEventListener('click', () => exportTableToCsv('topProductsTable', 'produtos_mais_vendidos.csv'));
        if (exportTopCustomersCsvBtn) exportTopCustomersCsvBtn.addEventListener('click', () => exportTableToCsv('topCustomersTable', 'top_clientes.csv'));
        if (exportSalesByDayCsvBtn) exportSalesByDayCsvBtn.addEventListener('click', () => exportTableToCsv('salesByDayTable', 'vendas_por_dia.csv'));

    }

    function showView(viewId) {
        views.forEach(view => view.classList.remove('active-view'));
        const targetView = document.getElementById(viewId);
        if (targetView) {
            targetView.classList.add('active-view');
            if (targetView.classList.contains('admin-section') && !isAdminLoggedIn) {
                showModal(adminLoginModal);
                showView('pdvView'); 
                navButtons.forEach(btn => btn.classList.remove('active'));
                const pdvNavBtn = document.querySelector('.nav-btn[data-target="pdvView"]');
                if (pdvNavBtn) pdvNavBtn.classList.add('active');
            }
        }
    }

    function showModal(modalElement) {
        if (modalElement) modalElement.style.display = 'flex';
    }

    function hideModal(modalElement) {
        if (modalElement) modalElement.style.display = 'none';
    }

    // --- LÓGICA DE AUTENTICAÇÃO ADMIN ---
    function handleAdminLogin() {
        const user = adminUserEl.value;
        const pass = adminPassEl.value;
        if (user === ADMIN_USER && pass === ADMIN_PASS) {
            isAdminLoggedIn = true;
            hideModal(adminLoginModal);
            if (adminLoginError) adminLoginError.style.display = 'none';
            checkAdminStatus();
            showView('reportsView'); 
            navButtons.forEach(btn => btn.classList.remove('active'));
            const reportsNavBtn = document.querySelector('.nav-btn[data-target="reportsView"]');
            if (reportsNavBtn) reportsNavBtn.classList.add('active');
        } else {
            if (adminLoginError) adminLoginError.style.display = 'block';
        }
    }

    function handleAdminLogout() {
        isAdminLoggedIn = false;
        checkAdminStatus();
        showView('pdvView'); 
        navButtons.forEach(btn => btn.classList.remove('active'));
        const pdvNavBtn = document.querySelector('.nav-btn[data-target="pdvView"]');
        if (pdvNavBtn) pdvNavBtn.classList.add('active');
    }

    function checkAdminStatus() {
        const adminOnlyElements = document.querySelectorAll('.admin-only');
        const adminSections = document.querySelectorAll('.admin-section');
        if (isAdminLoggedIn) {
            if (adminLoginBtn) adminLoginBtn.innerHTML = '<i class="fas fa-user-shield"></i> Admin ON';
            adminOnlyElements.forEach(el => el.style.display = 'inline-block'); 
        } else {
            if (adminLoginBtn) adminLoginBtn.innerHTML = '<i class="fas fa-lock"></i> Admin';
            adminOnlyElements.forEach(el => el.style.display = 'none');
            adminSections.forEach(sec => { 
                if (sec.classList.contains('active-view')) {
                    showView('pdvView'); 
                }
            });
        }
    }

    // --- LÓGICA DO PDV ---
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
    }
    
    function formatCurrency(value) {
        if (typeof value !== 'number') value = parseFloat(value) || 0;
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function handleOpenNewTicketModal() {
        editingTicketIdInput.value = '';
        ticketModalTitle.textContent = 'Nova Comanda';
        currentTicketItems = [];
        ticketCustomerSelect.value = '';
        ticketColorInput.value = '#FFA500'; 
        renderTicketItems();
        updateTicketTotal();
        paymentSection.style.display = 'none';
        saveTicketBtn.style.display = 'inline-block';
        closeAndPayTicketBtn.style.display = 'inline-block';
        sendTicketWhatsAppBtn.style.display = 'none';
        generatePdfReceiptBtn.style.display = 'none';
        deleteTicketBtn.style.display = 'none';

        // Para a grade de produtos
        populateProductCategoriesFilter(); 
        if(productGridSearchInput) productGridSearchInput.value = ''; 
        if(productGridCategoryFilter) productGridCategoryFilter.value = 'all'; 
        renderProductSelectionGrid(); 

        showModal(ticketModal);
    }
    
    function populateCustomerSelects() {
        if (!ticketCustomerSelect) return;
        const currentVal = ticketCustomerSelect.value; // Salva valor atual
        ticketCustomerSelect.innerHTML = '<option value="">Avulso</option>';
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = customer.name + (customer.isConvenio ? ' (Convênio)' : '');
            ticketCustomerSelect.appendChild(option);
        });
        ticketCustomerSelect.value = currentVal; // Tenta restaurar valor
    }
    
    // ---- FUNÇÕES DA NOVA GRADE DE PRODUTOS ----
    function renderProductSelectionGrid() {
        if (!productSelectionGrid) return;
        productSelectionGrid.innerHTML = ''; 

        const searchTerm = productGridSearchInput ? productGridSearchInput.value.toLowerCase() : "";
        const selectedCategory = productGridCategoryFilter ? productGridCategoryFilter.value : "all";

        const displayProducts = products.filter(product => {
            const nameMatch = product.name.toLowerCase().includes(searchTerm);
            const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory;
            return nameMatch && categoryMatch;
        });

        if (displayProducts.length === 0) {
            productSelectionGrid.innerHTML = '<p>Nenhum produto encontrado.</p>';
            return;
        }

        const productsByCategory = displayProducts.reduce((acc, product) => {
            const category = product.category || 'Outros';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {});

        const sortedCategories = Object.keys(productsByCategory).sort();

        sortedCategories.forEach(category => {
            const categoryHeader = document.createElement('h5');
            categoryHeader.classList.add('product-category-header');
            categoryHeader.textContent = category;
            productSelectionGrid.appendChild(categoryHeader);

            productsByCategory[category].forEach(product => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('product-select-item');
                itemDiv.dataset.productId = product.id;
                itemDiv.innerHTML = `
                    <span class="product-name">${product.name}</span>
                    <span class="product-price">${formatCurrency(product.price)}</span>
                `;
                productSelectionGrid.appendChild(itemDiv);
            });
        });
    }

    function populateProductCategoriesFilter() {
        if (!productGridCategoryFilter) return;
        
        const categories = [...new Set(products.map(p => p.category || 'Outros'))].sort();
        const previouslySelected = productGridCategoryFilter.value;

        productGridCategoryFilter.innerHTML = '<option value="all">Todas as Categorias</option>'; 
        
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            productGridCategoryFilter.appendChild(option);
        });

        if (categories.includes(previouslySelected)) {
            productGridCategoryFilter.value = previouslySelected;
        } else {
            productGridCategoryFilter.value = 'all';
        }
    }

    function filterProductsInGrid() {
        renderProductSelectionGrid(); 
    }

    function handleProductGridClick(event) {
        const clickedItem = event.target.closest('.product-select-item');
        if (!clickedItem) return;

        const productId = clickedItem.dataset.productId;
        const product = products.find(p => p.id === productId);

        if (product) {
            const existingItemIndex = currentTicketItems.findIndex(item => item.productId === productId);
            if (existingItemIndex > -1) {
                currentTicketItems[existingItemIndex].quantity++;
            } else {
                currentTicketItems.push({
                    productId: product.id,
                    name: product.name,
                    quantity: 1, 
                    priceAtSale: parseFloat(product.price),
                    costAtSale: parseFloat(product.cost) || 0
                });
            }
            renderTicketItems();
            updateTicketTotal();
        }
    }
    // ---- FIM DAS FUNÇÕES DA NOVA GRADE DE PRODUTOS ----


    function handleRemoveOrUpdateTicketItem(event) {
        const target = event.target;
        // A delegação de eventos agora é no container, então o data-index estará no botão, não no itemDiv
        const itemDiv = target.closest('.ticket-item');
        if (!itemDiv) return; 

        const itemIndex = parseInt(itemDiv.dataset.index); // Adicione data-index ao itemDiv em renderTicketItems

        if (target.classList.contains('remove-item-btn')) {
            currentTicketItems.splice(itemIndex, 1);
        } else if (target.classList.contains('qty-decrease')) {
            if (currentTicketItems[itemIndex].quantity > 1) {
                currentTicketItems[itemIndex].quantity--;
            } else { 
                 currentTicketItems[itemIndex].quantity--; 
            }
        } else if (target.classList.contains('qty-increase')) {
            currentTicketItems[itemIndex].quantity++;
        }
        
        currentTicketItems = currentTicketItems.filter(item => item.quantity > 0);

        renderTicketItems();
        updateTicketTotal();
    }

    function renderTicketItems() {
        ticketItemsContainer.innerHTML = '';
        if (currentTicketItems.length === 0) {
            ticketItemsContainer.innerHTML = '<p>Nenhum item adicionado.</p>';
            return;
        }
        currentTicketItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('ticket-item');
            itemDiv.dataset.index = index; // Adicionado para handleRemoveOrUpdateTicketItem
            itemDiv.innerHTML = `
                <span class="item-name">${item.name}</span>
                <span class="item-qty-price">
                    <button type="button" class="qty-decrease" title="Diminuir quantidade">-</button>
                    ${item.quantity} x ${formatCurrency(item.priceAtSale)}
                    <button type="button" class="qty-increase" title="Aumentar quantidade">+</button>
                </span>
                <span class="item-total">${formatCurrency(item.quantity * item.priceAtSale)}</span>
                <button type="button" class="remove-item-btn" title="Remover item">&times;</button>
            `;
            ticketItemsContainer.appendChild(itemDiv);
        });
    }

    function updateTicketTotal() {
        const total = currentTicketItems.reduce((sum, item) => sum + (item.quantity * item.priceAtSale), 0);
        ticketTotalValue.textContent = formatCurrency(total);
        return total;
    }
    
    function handleSaveTicket() {
        const ticketId = editingTicketIdInput.value;
        const customerId = ticketCustomerSelect.value;
        const color = ticketColorInput.value;

        if (currentTicketItems.length === 0 && !ticketId) { // Só barra se for nova e vazia
            alert('Adicione pelo menos um item à comanda.');
            return;
        }

        const total = updateTicketTotal();
        const customerData = customers.find(c=>c.id === customerId);

        if (ticketId) { 
            const ticketIndex = tickets.findIndex(t => t.id === ticketId);
            if (ticketIndex > -1) {
                tickets[ticketIndex] = {
                    ...tickets[ticketIndex],
                    customerId,
                    customerName: customerId ? customerData?.name : 'Avulso',
                    items: [...currentTicketItems],
                    total,
                    color,
                    updatedAt: new Date().toISOString()
                };
            }
        } else { 
            tickets.push({
                id: generateId(),
                customerId,
                customerName: customerId ? customerData?.name : 'Avulso',
                items: [...currentTicketItems],
                total,
                color,
                status: 'open', 
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }
        saveData('tickets', tickets);
        renderTicketsGrid();
        hideModal(ticketModal);
    }

    function renderTicketsGrid() {
        if (!ticketsGrid) return;
        ticketsGrid.innerHTML = '';
        const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'payment_pending');
        const recentlyPaidTickets = tickets.filter(t => t.status === 'paid')
                                     .sort((a,b) => new Date(b.closedAt) - new Date(a.closedAt))
                                     .slice(0, Math.max(0, 5 - openTickets.length)); // Mostrar até 5 no total, priorizando abertas
        
        const ticketsToShow = [...openTickets, ...recentlyPaidTickets].sort((a,b) => {
            if (a.status === 'open' && b.status !== 'open') return -1;
            if (a.status !== 'open' && b.status === 'open') return 1;
            if (a.status === 'payment_pending' && b.status === 'paid') return -1;
            if (a.status === 'paid' && b.status === 'payment_pending') return 1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (ticketsToShow.length === 0) {
            ticketsGrid.innerHTML = '<p>Nenhuma comanda. Clique em "Nova Comanda" para começar.</p>';
            return;
        }

        ticketsToShow.forEach(ticket => {
            const ticketCard = document.createElement('div');
            ticketCard.classList.add('ticket-card');
            ticketCard.style.backgroundColor = ticket.color || '#FFA500';
            ticketCard.dataset.ticketId = ticket.id;

            let customerName = ticket.customerName || 'Avulso';
            if (ticket.customerId && !ticket.customerName) { // Fallback se customerName não foi salvo
                const customer = customers.find(c => c.id === ticket.customerId);
                if (customer) customerName = customer.name;
            }
            
            let statusText = 'Aberta';
            if (ticket.status === 'payment_pending') statusText = 'Aguard. Pgto.';
            else if (ticket.status === 'paid') statusText = 'Paga';

            ticketCard.innerHTML = `
                <h3>Comanda #${ticket.id.substring(0, 6)}</h3>
                <p>Cliente: ${customerName}</p>
                <p>Total: ${formatCurrency(ticket.total)}</p>
                <p class="ticket-status ${ticket.status}">${statusText}</p>
            `;
            ticketCard.addEventListener('click', () => handleOpenExistingTicket(ticket.id));
            ticketsGrid.appendChild(ticketCard);
        });
    }

    function handleOpenExistingTicket(ticketId) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return;

        editingTicketIdInput.value = ticket.id;
        ticketModalTitle.textContent = `Editar Comanda #${ticket.id.substring(0, 6)}`;
        ticketCustomerSelect.value = ticket.customerId || '';
        ticketColorInput.value = ticket.color || '#FFA500';
        currentTicketItems = JSON.parse(JSON.stringify(ticket.items || [])); 

        renderTicketItems();
        updateTicketTotal();

        // Para a grade de produtos
        populateProductCategoriesFilter();
        if(productGridSearchInput) productGridSearchInput.value = ''; 
        if(productGridCategoryFilter) productGridCategoryFilter.value = 'all'; 
        renderProductSelectionGrid();

        if (ticket.status === 'open') {
            paymentSection.style.display = 'none';
            finalizePaymentBtn.style.display = 'none';
            saveTicketBtn.style.display = 'inline-block';
            closeAndPayTicketBtn.style.display = 'inline-block';
            sendTicketWhatsAppBtn.style.display = 'none';
            generatePdfReceiptBtn.style.display = 'none';
            deleteTicketBtn.style.display = 'inline-block';
        } else if (ticket.status === 'payment_pending') {
            paymentSection.style.display = 'block';
            finalizePaymentBtn.style.display = 'inline-block';
            saveTicketBtn.style.display = 'none';
            closeAndPayTicketBtn.style.display = 'none';
            sendTicketWhatsAppBtn.style.display = 'none';
            generatePdfReceiptBtn.style.display = 'none';
            deleteTicketBtn.style.display = 'inline-block'; 
            paymentMethodSelect.disabled = false;
            valorRecebidoInput.disabled = false;
            handlePaymentMethodChange(); 
        } else if (ticket.status === 'paid') {
            paymentSection.style.display = 'block'; 
            finalizePaymentBtn.style.display = 'none'; 
            saveTicketBtn.style.display = 'none';
            closeAndPayTicketBtn.style.display = 'none';
            sendTicketWhatsAppBtn.style.display = 'inline-block';
            generatePdfReceiptBtn.style.display = 'inline-block';
            deleteTicketBtn.style.display = 'none'; 
            paymentMethodSelect.value = ticket.paymentMethod || 'dinheiro';
            paymentMethodSelect.disabled = true; 
             if (ticket.paymentMethod === 'dinheiro' && typeof ticket.valorRecebido === 'number') {
                valorRecebidoInput.value = ticket.valorRecebido;
                valorRecebidoInput.disabled = true;
                trocoSection.style.display = 'block';
                calculateTroco();
            } else {
                trocoSection.style.display = 'none';
                valorRecebidoInput.value = '';
                 valorRecebidoInput.disabled = true;
            }
        }
        showModal(ticketModal);
    }

    function handleCloseAndPayTicket() {
        const isNewTicket = !editingTicketIdInput.value;
        // Salva quaisquer alterações antes de prosseguir para pagamento
        // Precisamos garantir que a comanda (especialmente se nova) seja salva primeiro
        // e que tenhamos o ID dela para o processo de pagamento.
        
        if (currentTicketItems.length === 0) {
            alert('Adicione itens à comanda antes de prosseguir para o pagamento.');
            return;
        }

        // Salva a comanda (ou atualiza se já existe)
        handleSaveTicket(); 
        
        // Se handleSaveTicket escondeu o modal (no caso de nova comanda), precisamos
        // encontrar o ID da comanda recém-salva para continuar.
        let ticketIdToPay = editingTicketIdInput.value;
        if (isNewTicket && !ticketIdToPay) {
            // A última comanda adicionada DEVE ser a que acabamos de salvar.
            // Isso é um pouco frágil, mas é a maneira mais simples sem reestruturar muito.
            const lastSavedTicket = tickets.filter(t => t.status === 'open')
                                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
            if (lastSavedTicket && JSON.stringify(lastSavedTicket.items) === JSON.stringify(currentTicketItems)) {
                ticketIdToPay = lastSavedTicket.id;
                editingTicketIdInput.value = ticketIdToPay; // Atualiza o ID no input oculto
            } else {
                alert("Erro ao identificar a comanda para pagamento. Tente salvar e abrir novamente.");
                return;
            }
        }
        
        if (!ticketIdToPay) {
             alert("Comanda não identificada para pagamento. Salve primeiro.");
             return;
        }


        const ticket = tickets.find(t => t.id === ticketIdToPay);
        if (!ticket) {
            alert('Comanda não encontrada para pagamento.');
            return;
        }

        ticket.status = 'payment_pending'; 
        saveData('tickets', tickets);
        renderTicketsGrid(); 

        paymentSection.style.display = 'block';
        paymentMethodSelect.value = 'dinheiro'; 
        paymentMethodSelect.disabled = false;
        valorRecebidoInput.value = '';
        valorRecebidoInput.disabled = false;
        valorTroco.textContent = formatCurrency(0);
        trocoSection.style.display = 'block'; 
        finalizePaymentBtn.style.display = 'inline-block';
        saveTicketBtn.style.display = 'none';
        closeAndPayTicketBtn.style.display = 'none'; 
        sendTicketWhatsAppBtn.style.display = 'none';
        generatePdfReceiptBtn.style.display = 'none';
        deleteTicketBtn.style.display = 'inline-block'; // Permitir deletar se pagamento pendente

        if (!ticketModal.style.display || ticketModal.style.display === 'none') {
            // Reabre o modal se handleSaveTicket o fechou, já com o ID correto
            handleOpenExistingTicket(ticketIdToPay);
        }
    }
    
    function handlePaymentMethodChange() {
        if (paymentMethodSelect.value === 'dinheiro') {
            trocoSection.style.display = 'block';
            calculateTroco();
        } else {
            trocoSection.style.display = 'none';
        }
    }

    function calculateTroco() {
        const totalText = ticketTotalValue.textContent;
        const total = parseFloat(totalText.replace('R$', '').replace(/\./g, '').replace(',', '.')) || 0;
        const recebido = parseFloat(valorRecebidoInput.value) || 0;
        const troco = recebido - total;
        valorTroco.textContent = formatCurrency(Math.max(0, troco)); 
    }

    function handleFinalizePayment() {
        const ticketId = editingTicketIdInput.value;
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {
            alert('Comanda não encontrada.');
            return;
        }

        const paymentMethod = paymentMethodSelect.value;
        const total = ticket.total;

        if (paymentMethod === 'dinheiro') {
            const recebido = parseFloat(valorRecebidoInput.value) || 0;
            if (recebido < total) {
                alert('Valor recebido é menor que o total da comanda.');
                return;
            }
            ticket.valorRecebido = recebido;
            ticket.troco = recebido - total;
        }
        
        const customer = customers.find(c => c.id === ticket.customerId);
        if (paymentMethod === 'convenio') {
            if (!ticket.customerId || !customer || !customer.isConvenio) {
                alert('Este cliente não está habilitado para convênio ou não é um cliente cadastrado válido.');
                return;
            }
        }

        ticket.paymentMethod = paymentMethod;
        ticket.status = 'paid';
        ticket.closedAt = new Date().toISOString();

        saveData('tickets', tickets);
        renderTicketsGrid();
        
        finalizePaymentBtn.style.display = 'none';
        sendTicketWhatsAppBtn.style.display = 'inline-block';
        generatePdfReceiptBtn.style.display = 'inline-block';
        paymentMethodSelect.disabled = true;
        valorRecebidoInput.disabled = true;
        deleteTicketBtn.style.display = 'none'; // Não pode mais deletar diretamente após pago

        alert(`Comanda ${ticket.id.substring(0,6)} finalizada com sucesso! (${translatePaymentMethod(paymentMethod)})`);
    }
    
    function handleDeleteTicket() {
        const ticketId = editingTicketIdInput.value;
        if (!ticketId) return;
        
        const ticket = tickets.find(t => t.id === ticketId);
        if (ticket && ticket.status === 'paid') {
            alert("Comandas pagas não podem ser excluídas diretamente. Considere um estorno (funcionalidade futura).");
            return;
        }

        if (confirm(`Tem certeza que deseja excluir a comanda #${ticketId.substring(0,6)}? Esta ação não pode ser desfeita.`)) {
            tickets = tickets.filter(t => t.id !== ticketId);
            saveData('tickets', tickets);
            renderTicketsGrid();
            hideModal(ticketModal);
        }
    }

    function getTicketReceiptText(ticketId) {
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) return { receiptText: "Recibo não encontrado.", customerPhone: ""};

        let customerName = ticket.customerName || "Avulso";
        let customerPhone = "";
        if (ticket.customerId) {
            const customer = customers.find(c => c.id === ticket.customerId);
            if (customer) {
                customerName = customer.name; // Sobrescreve se achou o cliente
                customerPhone = customer.phone || "";
            }
        }


        let receipt = `*Comprovante Arena Bar*\n`;
        receipt += `----------------------\n`;
        receipt += `Comanda: #${ticket.id.substring(0, 6)}\n`;
        receipt += `Cliente: ${customerName}\n`;
        if (ticket.closedAt) {
            receipt += `Data: ${new Date(ticket.closedAt).toLocaleString('pt-BR')}\n`;
        } else {
            receipt += `Data: ${new Date(ticket.createdAt).toLocaleString('pt-BR')}\n`;
        }
        receipt += `----------------------\n`;
        receipt += `*Itens Consumidos:*\n`;
        (ticket.items || []).forEach(item => {
            receipt += `${item.quantity}x ${item.name} - ${formatCurrency(item.quantity * item.priceAtSale)}\n`;
        });
        receipt += `----------------------\n`;
        receipt += `*Total: ${formatCurrency(ticket.total)}*\n`;

        if (ticket.status === 'paid') {
            receipt += `Forma de Pagamento: ${translatePaymentMethod(ticket.paymentMethod)}\n`;
            if (ticket.paymentMethod === 'dinheiro' && typeof ticket.valorRecebido === 'number') {
                receipt += `Valor Recebido: ${formatCurrency(ticket.valorRecebido)}\n`;
                receipt += `Troco: ${formatCurrency(ticket.troco)}\n`;
            }
        }
        receipt += `----------------------\n`;
        receipt += `Obrigado pela preferência!`;
        return { receiptText: receipt, customerPhone };
    }

    function translatePaymentMethod(method) {
        const methods = {
            'dinheiro': 'Dinheiro',
            'cartao_debito': 'Cartão de Débito',
            'cartao_credito': 'Cartão de Crédito',
            'pix': 'PIX',
            'convenio': 'Convênio (Pagar Depois)'
        };
        return methods[method] || method;
    }

    function handleSendTicketWhatsApp() {
        const ticketId = editingTicketIdInput.value;
        const { receiptText, customerPhone } = getTicketReceiptText(ticketId);
        
        let targetPhone = customerPhone;

        if (!targetPhone) {
            const userProvidedPhone = prompt("Cliente sem telefone cadastrado ou comanda avulsa.\nDigite o número do WhatsApp do cliente (com DDD, ex: 55119...):", "");
            if (userProvidedPhone) {
                const cleanedPhone = userProvidedPhone.replace(/\D/g,'');
                if (/^[0-9]{10,13}$/.test(cleanedPhone)) { 
                    targetPhone = cleanedPhone.startsWith('55') ? cleanedPhone : '55' + cleanedPhone;
                } else {
                    alert("Número de telefone inválido.");
                    return;
                }
            } else { 
                return; // Cancelou o prompt
            }
        } else {
             targetPhone = targetPhone.replace(/\D/g,''); // Limpa
             if (!targetPhone.startsWith('55')) { 
                targetPhone = '55' + targetPhone;
            }
        }

        const encodedText = encodeURIComponent(receiptText);
        const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;
        
        window.open(whatsappUrl, '_blank');
    }

    function handleGeneratePdfReceipt() {
        const ticketId = editingTicketIdInput.value;
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {
            alert("Comanda não encontrada para gerar PDF.");
            return;
        }

        const { jsPDF } = window.jspdf; // Garante que está pegando do objeto global
        const doc = new jsPDF();

        let customerName = ticket.customerName || "Avulso";
        if (ticket.customerId && !ticket.customerName) {
            const customer = customers.find(c => c.id === ticket.customerId);
            if (customer) customerName = customer.name;
        }

        doc.setFontSize(18);
        doc.text("Comprovante Arena Bar", 105, 20, null, null, "center");
        
        doc.setFontSize(12);
        doc.text(`Comanda: #${ticket.id.substring(0, 6)}`, 14, 35);
        doc.text(`Cliente: ${customerName}`, 14, 42);
        const dateStr = ticket.closedAt ? new Date(ticket.closedAt).toLocaleString('pt-BR') : new Date(ticket.createdAt).toLocaleString('pt-BR');
        doc.text(`Data: ${dateStr}`, 14, 49);

        doc.setFontSize(14);
        doc.text("Itens Consumidos:", 14, 63);
        
        const tableColumn = ["Qtd", "Produto", "Preço Unit.", "Total Item"];
        const tableRows = [];

        (ticket.items || []).forEach(item => {
            const itemData = [
                item.quantity,
                item.name,
                formatCurrency(item.priceAtSale),
                formatCurrency(item.quantity * item.priceAtSale)
            ];
            tableRows.push(itemData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 70,
            theme: 'striped', 
            headStyles: { fillColor: [255, 165, 0] } 
        });

        let finalY = doc.lastAutoTable.finalY || 70; 
        finalY += 10;

        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text(`Total: ${formatCurrency(ticket.total)}`, 14, finalY);
        doc.setFont(undefined, 'normal');

        if (ticket.status === 'paid') {
            finalY += 7;
            doc.text(`Forma de Pagamento: ${translatePaymentMethod(ticket.paymentMethod)}`, 14, finalY);
            if (ticket.paymentMethod === 'dinheiro' && typeof ticket.valorRecebido === 'number') {
                finalY += 7;
                doc.text(`Valor Recebido: ${formatCurrency(ticket.valorRecebido)}`, 14, finalY);
                finalY += 7;
                doc.text(`Troco: ${formatCurrency(ticket.troco)}`, 14, finalY);
            }
        }
        
        finalY += 14;
        doc.text("Obrigado pela preferência!", 105, finalY, null, null, "center");
        
        doc.save(`recibo_comanda_${ticket.id.substring(0,6)}.pdf`);
    }


    // --- LÓGICA DE PRODUTOS (GERENCIAMENTO) ---
    function handleOpenNewProductModal() {
        editingProductIdInput.value = '';
        productModalTitle.textContent = 'Adicionar Produto';
        productNameInput.value = '';
        productCategorySelect.value = 'Cervejas';
        productPriceInput.value = '';
        productCostInput.value = '';
        showModal(productModal);
    }
    
    function handleSaveProduct() {
        const id = editingProductIdInput.value;
        const name = productNameInput.value.trim();
        const category = productCategorySelect.value;
        const price = parseFloat(productPriceInput.value);
        const cost = parseFloat(productCostInput.value) || 0;

        if (!name || isNaN(price) || price <=0) {
            alert('Nome e Preço (válido) são obrigatórios.');
            return;
        }

        if (id) { 
            const index = products.findIndex(p => p.id === id);
            if (index > -1) {
                products[index] = { ...products[index], name, category, price, cost };
            }
        } else { 
            products.push({ id: generateId(), name, category, price, cost });
        }
        saveData('products', products);
        renderProducts(); // Atualiza tabela de gerenciamento
        populateProductCategoriesFilter(); // Atualiza filtro da grade no modal de comanda
        renderProductSelectionGrid(); // Atualiza a grade no modal de comanda
        hideModal(productModal);
    }

    function renderProducts(searchTerm = '') { // Para a tabela de gerenciamento
        if (!productsTableBody) return;
        productsTableBody.innerHTML = '';
        const filteredProducts = products.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredProducts.length === 0) {
            productsTableBody.innerHTML = '<tr><td colspan="5">Nenhum produto encontrado.</td></tr>';
            return;
        }
        filteredProducts.forEach(product => {
            const row = productsTableBody.insertRow();
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${formatCurrency(product.cost)}</td>
                <td>
                    <button class="edit-product-btn" data-id="${product.id}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="delete-product-btn" data-id="${product.id}"><i class="fas fa-trash"></i> Excluir</button>
                </td>
            `;
        });
        productsTableBody.querySelectorAll('.edit-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEditProduct(e.currentTarget.dataset.id));
        });
        productsTableBody.querySelectorAll('.delete-product-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDeleteProduct(e.currentTarget.dataset.id));
        });
    }

    function handleEditProduct(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;
        editingProductIdInput.value = product.id;
        productModalTitle.textContent = 'Editar Produto';
        productNameInput.value = product.name;
        productCategorySelect.value = product.category;
        productPriceInput.value = product.price;
        productCostInput.value = product.cost || '';
        showModal(productModal);
    }

    function handleDeleteProduct(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            products = products.filter(p => p.id !== id);
            saveData('products', products);
            renderProducts();
            populateProductCategoriesFilter(); 
            renderProductSelectionGrid();
        }
    }

    // --- LÓGICA DE CLIENTES ---
    function handleOpenNewCustomerModal(isQuickAdd = false) {
        editingCustomerIdInput.value = '';
        customerModalTitle.textContent = 'Adicionar Cliente';
        customerNameInput.value = '';
        customerPhoneInput.value = '';
        customerConvenioCheckbox.checked = false;
        customerModal.dataset.isQuickAdd = isQuickAdd; // Armazena se é adição rápida
        showModal(customerModal);
    }

    function handleSaveCustomer() {
        const id = editingCustomerIdInput.value;
        const name = customerNameInput.value.trim();
        const phone = customerPhoneInput.value.trim().replace(/\D/g,'');
        const isConvenio = customerConvenioCheckbox.checked;

        if (!name) {
            alert('Nome do cliente é obrigatório.');
            return;
        }
         if (phone && !/^[0-9]{10,13}$/.test(phone)) { 
            alert('Telefone inválido. Use apenas números, incluindo DDD (10 a 13 dígitos).');
            return;
        }

        let newCustomerId = id;
        if (id) { 
            const index = customers.findIndex(c => c.id === id);
            if (index > -1) {
                customers[index] = { ...customers[index], name, phone, isConvenio };
            }
        } else { 
            newCustomerId = generateId();
            customers.push({ id: newCustomerId, name, phone, isConvenio });
        }
        saveData('customers', customers);
        renderCustomers();
        populateCustomerSelects(); // Atualiza o select de clientes no modal de comanda
        hideModal(customerModal);

        if (customerModal.dataset.isQuickAdd === 'true') {
            showModal(ticketModal);
            if(newCustomerId) ticketCustomerSelect.value = newCustomerId; // Seleciona o cliente recém-adicionado
        }
        customerModal.dataset.isQuickAdd = 'false'; 
    }

    function renderCustomers(searchTerm = '') {
        if (!customersTableBody) return;
        customersTableBody.innerHTML = '';
        const filteredCustomers = customers.filter(c => 
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredCustomers.length === 0) {
            customersTableBody.innerHTML = '<tr><td colspan="4">Nenhum cliente encontrado.</td></tr>';
            return;
        }
        filteredCustomers.forEach(customer => {
            const row = customersTableBody.insertRow();
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.isConvenio ? 'Sim' : 'Não'}</td>
                <td>${customer.phone ? formatPhoneNumber(customer.phone) : '-'}</td>
                <td>
                    <button class="edit-customer-btn" data-id="${customer.id}"><i class="fas fa-user-edit"></i> Editar</button>
                    <button class="delete-customer-btn" data-id="${customer.id}"><i class="fas fa-user-times"></i> Excluir</button>
                </td>
            `;
        });
        customersTableBody.querySelectorAll('.edit-customer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEditCustomer(e.currentTarget.dataset.id));
        });
        customersTableBody.querySelectorAll('.delete-customer-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDeleteCustomer(e.currentTarget.dataset.id));
        });
    }
    
    function formatPhoneNumber(phoneStr) {
        if (!phoneStr) return "";
        const cleaned = ('' + phoneStr).replace(/\D/g, '');
        // Tenta formatar para (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
        if (cleaned.length === 11) {
            const match = cleaned.match(/^(\d{2})(\d{1})(\d{4})(\d{4})$/);
            if (match) return `(${match[1]}) ${match[2]} ${match[3]}-${match[4]}`;
        } else if (cleaned.length === 10) {
             const match = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
            if (match) return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        return phoneStr; 
    }


    function handleEditCustomer(id) {
        const customer = customers.find(c => c.id === id);
        if (!customer) return;
        editingCustomerIdInput.value = customer.id;
        customerModalTitle.textContent = 'Editar Cliente';
        customerNameInput.value = customer.name;
        customerPhoneInput.value = customer.phone || '';
        customerConvenioCheckbox.checked = customer.isConvenio;
        customerModal.dataset.isQuickAdd = 'false'; 
        showModal(customerModal);
    }

    function handleDeleteCustomer(id) {
        if (confirm('Tem certeza que deseja excluir este cliente?')) {
            customers = customers.filter(c => c.id !== id);
            saveData('customers', customers);
            renderCustomers();
            populateCustomerSelects(); 
        }
    }
    
    // --- LÓGICA DE EVENTOS ---
    function handleOpenNewEventModal() {
        editingEventIdInput.value = '';
        eventModalTitle.textContent = 'Adicionar Evento';
        eventDateInput.value = new Date().toISOString().split('T')[0]; 
        eventDescriptionInput.value = '';
        eventLiveMusicCheckbox.checked = false;
        showModal(eventModal);
    }

    function handleSaveEvent() {
        const id = editingEventIdInput.value;
        const date = eventDateInput.value;
        const description = eventDescriptionInput.value.trim();
        const liveMusic = eventLiveMusicCheckbox.checked;

        if (!date || !description) {
            alert('Data e Descrição são obrigatórias para o evento.');
            return;
        }

        if (id) { 
            const index = events.findIndex(e => e.id === id);
            if (index > -1) {
                events[index] = { ...events[index], date, description, liveMusic };
            }
        } else { 
            events.push({ id: generateId(), date, description, liveMusic });
        }
        events.sort((a,b) => new Date(a.date) - new Date(b.date)); 
        saveData('events', events);
        renderEvents();
        hideModal(eventModal);
    }

    function renderEvents() {
        if (!eventsListContainer) return;
        eventsListContainer.innerHTML = '';
        
        const today = new Date();
        today.setHours(0,0,0,0); // Zera a hora para comparar apenas a data

        const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.date + "T00:00:00"); // Considera a data no fuso local
            return eventDate >= today;
        }); 
        
        if (upcomingEvents.length === 0) {
            eventsListContainer.innerHTML = '<p>Nenhum evento futuro cadastrado.</p>';
            return;
        }

        upcomingEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.classList.add('event-card');
            const eventDateObj = new Date(event.date + "T00:00:00"); // Data local para exibição

            eventCard.innerHTML = `
                <h4>${eventDateObj.toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'})} - ${event.description}</h4>
                <p>Música ao Vivo: ${event.liveMusic ? 'Sim <i class="fas fa-music" style="color: var(--brand-orange);"></i>' : 'Não'}</p>
                <div class="event-actions">
                    <button class="edit-event-btn" data-id="${event.id}" title="Editar Evento"><i class="fas fa-edit"></i></button>
                    <button class="delete-event-btn" data-id="${event.id}" title="Excluir Evento"><i class="fas fa-trash"></i></button>
                </div>
            `;
            eventsListContainer.appendChild(eventCard);
        });

        eventsListContainer.querySelectorAll('.edit-event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleEditEvent(e.currentTarget.dataset.id));
        });
        eventsListContainer.querySelectorAll('.delete-event-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handleDeleteEvent(e.currentTarget.dataset.id));
        });
    }
    
    function handleEditEvent(id) {
        const event = events.find(e => e.id === id);
        if (!event) return;
        editingEventIdInput.value = event.id;
        eventModalTitle.textContent = 'Editar Evento';
        eventDateInput.value = event.date;
        eventDescriptionInput.value = event.description;
        eventLiveMusicCheckbox.checked = event.liveMusic;
        showModal(eventModal);
    }

    function handleDeleteEvent(id) {
        if (confirm('Tem certeza que deseja excluir este evento?')) {
            events = events.filter(e => e.id !== id);
            saveData('events', events);
            renderEvents();
        }
    }

    // --- LÓGICA DE CONFIGURAÇÕES ---
    function toggleTheme() {
        document.body.classList.toggle('theme-dark');
        document.body.classList.toggle('theme-light');
        settings.theme = document.body.classList.contains('theme-dark') ? 'theme-dark' : 'theme-light';
        saveData('settings', settings);
    }
    function applyTheme(themeName) {
        document.body.className = ''; // Limpa classes existentes
        document.body.classList.add(themeName);
    }

    function loadFixedCosts() {
        if (fixedCostsInput) fixedCostsInput.value = settings.fixedCosts || 0;
    }
    function saveFixedCosts() {
        const cost = parseFloat(fixedCostsInput.value);
        if (isNaN(cost) || cost < 0) {
            alert('Custo fixo inválido.');
            return;
        }
        settings.fixedCosts = cost;
        saveData('settings', settings);
        alert('Custos fixos salvos!');
    }

    function exportAllData() {
        if (!isAdminLoggedIn) { alert("Acesso negado."); return; }
        const dataToExport = {
            products,
            customers,
            tickets,
            events,
            settings
        };
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `arenabar_pdv_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        alert('Dados exportados com sucesso!');
    }

    function importAllData(event) {
        if (!isAdminLoggedIn) { alert("Acesso negado."); return; }
        const file = event.target.files[0];
        if (!file) return;

        if (!confirm("Atenção: Importar dados substituirá TODOS os dados atuais. Deseja continuar?")) {
            importDataFile.value = ''; 
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                if (importedData.products && importedData.customers && importedData.tickets && importedData.events && importedData.settings) {
                    products = importedData.products;
                    customers = importedData.customers;
                    tickets = importedData.tickets;
                    events = importedData.events;
                    settings = importedData.settings;

                    saveData('products', products);
                    saveData('customers', customers);
                    saveData('tickets', tickets);
                    saveData('events', events);
                    saveData('settings', settings);

                    applyTheme(settings.theme);
                    loadFixedCosts();
                    renderAll();
                    alert('Dados importados com sucesso! A página será recarregada.');
                    location.reload(); 
                } else {
                    alert('Arquivo de importação inválido ou incompleto.');
                }
            } catch (error) {
                alert('Erro ao ler o arquivo de importação: ' + error.message);
            } finally {
                importDataFile.value = ''; 
            }
        };
        reader.readAsText(file);
    }
    
    // --- LÓGICA DE RELATÓRIOS ---
    function getFilteredTickets() {
        const startDateStr = reportStartDateInput.value;
        const endDateStr = reportEndDateInput.value;

        if (!startDateStr || !endDateStr) {
            // Retorna todos os pagos se não houver data, para cálculo geral
             return tickets.filter(t => t.status === 'paid'); 
        }
        const startDate = new Date(startDateStr + "T00:00:00");
        const endDate = new Date(endDateStr + "T23:59:59");

        return tickets.filter(ticket => {
            if (ticket.status !== 'paid' || !ticket.closedAt) return false;
            const closedDate = new Date(ticket.closedAt);
            return closedDate >= startDate && closedDate <= endDate;
        });
    }

    function generateAllReports() {
        if (!isAdminLoggedIn) { alert("Acesso negado."); return; }
        const filteredTickets = getFilteredTickets();
        
        if (!reportStartDateInput.value || !reportEndDateInput.value) {
             alert("Por favor, selecione as datas de início e fim para gerar relatórios específicos do período. Mostrando dados gerais de tickets pagos.");
        }


        generateSummaryReport(filteredTickets);
        generateTopProductsReport(filteredTickets);
        generateTopCustomersReport(filteredTickets);
        generateSalesByDayReport(filteredTickets);
    }

    function generateSummaryReport(reportTickets) {
        const totalSales = reportTickets.reduce((sum, ticket) => sum + ticket.total, 0);
        const totalClosed = reportTickets.length;
        
        const totalCostOfGoods = reportTickets.reduce((sum, ticket) => {
            return sum + (ticket.items || []).reduce((itemSum, item) => itemSum + ((item.costAtSale || 0) * item.quantity), 0);
        }, 0);
        const estimatedProfit = totalSales - totalCostOfGoods;

        if(totalSalesValue) totalSalesValue.textContent = formatCurrency(totalSales);
        if(totalTicketsClosed) totalTicketsClosed.textContent = totalClosed;
        if(totalProfitValue) totalProfitValue.textContent = formatCurrency(estimatedProfit);
    }

    function generateTopProductsReport(reportTickets) {
        if (!topProductsTableBody) return;
        const productSales = {};
        reportTickets.forEach(ticket => {
            (ticket.items || []).forEach(item => {
                if (!productSales[item.productId]) {
                    productSales[item.productId] = { name: item.name, quantity: 0, revenue: 0 };
                }
                productSales[item.productId].quantity += item.quantity;
                productSales[item.productId].revenue += item.quantity * item.priceAtSale;
            });
        });

        const sortedProducts = Object.values(productSales).sort((a, b) => b.quantity - a.quantity); 

        topProductsTableBody.innerHTML = '';
        if (sortedProducts.length === 0) {
            topProductsTableBody.innerHTML = '<tr><td colspan="3">Nenhum produto vendido no período.</td></tr>';
            return;
        }
        sortedProducts.slice(0, 10).forEach(p => { // Mostra top 10
            const row = topProductsTableBody.insertRow();
            row.innerHTML = `<td>${p.name}</td><td>${p.quantity}</td><td>${formatCurrency(p.revenue)}</td>`;
        });
    }
    
    function generateTopCustomersReport(reportTickets) {
        if(!topCustomersTableBody) return;
        const customerSales = {};
        reportTickets.forEach(ticket => {
            const customerId = ticket.customerId || 'avulso_' + generateId(); // ID único para avulsos
            let customerName = ticket.customerName || 'Cliente Avulso';
            
            if (!customerSales[customerId]) {
                customerSales[customerId] = { name: customerName, totalSpent: 0, ticketCount: 0 };
            }
            customerSales[customerId].totalSpent += ticket.total;
            customerSales[customerId].ticketCount++;
        });

        const sortedCustomers = Object.values(customerSales)
                                .filter(c => c.name !== 'Cliente Avulso') // Opcional: remover avulsos do top
                                .sort((a, b) => b.totalSpent - a.totalSpent);

        topCustomersTableBody.innerHTML = '';
        if (sortedCustomers.length === 0) {
            topCustomersTableBody.innerHTML = '<tr><td colspan="3">Nenhuma venda para clientes cadastrados no período.</td></tr>';
            return;
        }
        sortedCustomers.slice(0, 10).forEach(c => { // Mostra top 10
            const row = topCustomersTableBody.insertRow();
            row.innerHTML = `<td>${c.name}</td><td>${formatCurrency(c.totalSpent)}</td><td>${c.ticketCount}</td>`;
        });
    }

    function generateSalesByDayReport(reportTickets) {
        if(!salesByDayTableBody) return;
        const salesByDay = {};
        reportTickets.forEach(ticket => {
            if (!ticket.closedAt) return;
            const date = new Date(ticket.closedAt).toISOString().split('T')[0]; 
            if (!salesByDay[date]) {
                salesByDay[date] = { totalSold: 0, ticketCount: 0 };
            }
            salesByDay[date].totalSold += ticket.total;
            salesByDay[date].ticketCount++;
        });
        
        const sortedDays = Object.entries(salesByDay).sort((a,b) => new Date(a[0]) - new Date(b[0])); 

        salesByDayTableBody.innerHTML = '';
         if (sortedDays.length === 0) {
            salesByDayTableBody.innerHTML = '<tr><td colspan="3">Nenhuma venda no período.</td></tr>';
            return;
        }
        sortedDays.forEach(([date, data]) => {
            const row = salesByDayTableBody.insertRow();
            const displayDate = new Date(date + "T00:00:00").toLocaleDateString('pt-BR', {timeZone: 'America/Sao_Paulo'}); 
            row.innerHTML = `<td>${displayDate}</td><td>${formatCurrency(data.totalSold)}</td><td>${data.ticketCount}</td>`;
        });
    }

    function exportTableToCsv(tableId, filename) {
        if (!isAdminLoggedIn) { alert("Acesso negado."); return; }
        const table = document.getElementById(tableId);
        if (!table) return;

        let csvContent = "data:text/csv;charset=utf-8,";
        const rows = table.querySelectorAll("tr");
        
        rows.forEach(function(row) {
            let rowData = [];
            row.querySelectorAll("th, td").forEach(function(cell) {
                let cellText = cell.innerText.replace(/(\r\n|\n|\r)/gm, " ").replace(/\s+/g, " ").trim();
                if (cellText.includes("R$")) {
                    cellText = cellText.replace("R$", "").trim().replace(/\./g, "").replace(",", ".");
                }
                rowData.push(`"${cellText.replace(/"/g, '""')}"`); // Trata aspas internas
            });
            csvContent += rowData.join(",") + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- INICIA A APLICAÇÃO ---
    initApp();
});