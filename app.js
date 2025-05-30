// Simulação de banco de dados
let vehicles = [];
let reservations = [];
let clients = [];
let users = [
    { id: 1, username: 'admin', password: 'admin123', type: 'admin' },
    { id: 2, username: 'atendente', password: 'atendente123', type: 'atendente' }
];

// Elementos da página
const pages = {
    home: document.getElementById('home-page'),
    vehicles: document.getElementById('vehicles-page'),
    reservation: document.getElementById('reservation-page'),
    login: document.getElementById('login-page'),
    confirmation: document.getElementById('confirmation-page')
};

// Links de navegação
const navLinks = {
    home: document.getElementById('home-link'),
    vehicles: document.getElementById('vehicles-link'),
    reservation: document.getElementById('reservation-link'),
    login: document.getElementById('login-link'),
    register: document.getElementById('register-link')
};

// Formulários
const forms = {
    search: document.getElementById('search-form'),
    reservation: document.getElementById('reservation-form'),
    login: document.getElementById('login-form')
};

// Outros elementos
const reserveNowBtn = document.getElementById('reserve-now');
const backToHomeBtn = document.getElementById('back-to-home');
const printContractBtn = document.getElementById('print-contract');
const vehicleList = document.getElementById('vehicle-list');
const resVehicleSelect = document.getElementById('res-vehicle');
const paymentMethodSelect = document.getElementById('payment-method');
const creditCardInfo = document.getElementById('credit-card-info');
const reservationDetails = document.getElementById('reservation-details');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Carrega dados iniciais
    loadInitialData();
    
    // Configura navegação
    setupNavigation();
    
    // Configura listeners de formulários
    setupFormListeners();
    
    // Mostra a página inicial por padrão
    showPage('home');
});

function loadInitialData() {
    // Carrega veículos
    vehicles = [
        { id: 1, brand: 'Fiat', model: 'Argo', year: 2022, plate: 'ABC1D23', type: 'compacto', dailyRate: 120, status: 'available', image: 'argo.jpg' },
        { id: 2, brand: 'Volkswagen', model: 'Golf', year: 2021, plate: 'DEF4G56', type: 'hatch', dailyRate: 180, status: 'available', image: 'golf.jpg' },
        { id: 3, brand: 'Chevrolet', model: 'Onix Plus', year: 2023, plate: 'GHI7J89', type: 'sedan', dailyRate: 150, status: 'available', image: 'onix.jpg' },
        { id: 4, brand: 'Jeep', model: 'Renegade', year: 2022, plate: 'KLM1N23', type: 'suv', dailyRate: 220, status: 'available', image: 'renegade.jpg' },
        { id: 5, brand: 'BMW', model: '320i', year: 2021, plate: 'OPQ4R56', type: 'luxo', dailyRate: 350, status: 'available', image: 'bmw.jpg' },
        { id: 6, brand: 'Toyota', model: 'Corolla', year: 2023, plate: 'STU7V89', type: 'sedan', dailyRate: 250, status: 'available', image: 'corolla.jpg' }
    ];
    
    // Preenche dropdown de veículos na página de reserva
    updateVehicleDropdown();
    
    // Preenche lista de veículos na página de frota
    renderVehicleList(vehicles);
}

function setupNavigation() {
    // Navegação principal
    navLinks.home.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home');
    });
    
    navLinks.vehicles.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('vehicles');
    });
    
    navLinks.reservation.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('reservation');
    });
    
    navLinks.login.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('login');
    });
    
    navLinks.register.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Funcionalidade de cadastro será implementada na próxima versão.');
    });
    
    // Botão "Reserve agora" na home
    reserveNowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('reservation');
    });
    
    // Botão "Voltar à página inicial" na confirmação
    backToHomeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('home');
    });
    
    // Botão "Imprimir contrato"
    printContractBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.print();
    });
}

function setupFormListeners() {
    // Formulário de busca
    forms.search.addEventListener('submit', function(e) {
        e.preventDefault();
        showPage('vehicles');
    });
    
    // Formulário de reserva
    forms.reservation.addEventListener('submit', function(e) {
        e.preventDefault();
        processReservation();
    });
    
    // Formulário de login
    forms.login.addEventListener('submit', function(e) {
        e.preventDefault();
        processLogin();
    });
    
    // Mostrar/ocultar informações do cartão de crédito
    paymentMethodSelect.addEventListener('change', function() {
        if (this.value === 'credit') {
            creditCardInfo.classList.remove('hidden');
        } else {
            creditCardInfo.classList.add('hidden');
        }
    });
    
    // Calcular valor total quando datas são alteradas
    document.getElementById('res-pickup-date').addEventListener('change', calculateTotal);
    document.getElementById('res-return-date').addEventListener('change', calculateTotal);
    resVehicleSelect.addEventListener('change', calculateTotal);
}

function showPage(pageName) {
    // Oculta todas as páginas
    Object.values(pages).forEach(page => {
        page.classList.remove('active');
    });
    
    // Mostra a página solicitada
    pages[pageName].classList.add('active');
}

function renderVehicleList(vehiclesToRender) {
    vehicleList.innerHTML = '';
    
    vehiclesToRender.forEach(vehicle => {
        const vehicleCard = document.createElement('div');
        vehicleCard.className = 'vehicle-card';
        
        vehicleCard.innerHTML = `
            <div class="vehicle-image" style="background-image: url('img/${vehicle.image}')"></div>
            <div class="vehicle-info">
                <h3>${vehicle.brand} ${vehicle.model}</h3>
                <div class="vehicle-meta">
                    <span>${vehicle.year}</span>
                    <span>${vehicle.type}</span>
                </div>
                <div class="vehicle-price">R$ ${vehicle.dailyRate}/dia</div>
                <button class="btn reserve-btn" data-id="${vehicle.id}">Reservar</button>
            </div>
        `;
        
        vehicleList.appendChild(vehicleCard);
    });
    
    // Adiciona listeners aos botões de reserva
    document.querySelectorAll('.reserve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const vehicleId = parseInt(this.getAttribute('data-id'));
            startReservation(vehicleId);
        });
    });
}

function updateVehicleDropdown() {
    resVehicleSelect.innerHTML = '<option value="">Selecione um veículo</option>';
    
    vehicles.filter(v => v.status === 'available').forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = `${vehicle.brand} ${vehicle.model} - R$ ${vehicle.dailyRate}/dia`;
        resVehicleSelect.appendChild(option);
    });
}

function startReservation(vehicleId) {
    showPage('reservation');
    resVehicleSelect.value = vehicleId;
    calculateTotal();
}

function calculateTotal() {
    const vehicleId = parseInt(resVehicleSelect.value);
    const pickupDate = new Date(document.getElementById('res-pickup-date').value);
    const returnDate = new Date(document.getElementById('res-return-date').value);
    
    if (vehicleId && !isNaN(pickupDate.getTime()) && !isNaN(returnDate.getTime())) {
        const vehicle = vehicles.find(v => v.id === vehicleId);
        const days = Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
        const total = days * vehicle.dailyRate;
        
        document.getElementById('res-total').value = `R$ ${total.toFixed(2)} (${days} dias)`;
    } else {
        document.getElementById('res-total').value = '';
    }
}

function processReservation() {
    // Coleta dados do formulário
    const vehicleId = parseInt(resVehicleSelect.value);
    const pickupDate = document.getElementById('res-pickup-date').value;
    const returnDate = document.getElementById('res-return-date').value;
    const totalValue = document.getElementById('res-total').value;
    
    const clientData = {
        name: document.getElementById('client-name').value,
        cpf: document.getElementById('client-cpf').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        address: document.getElementById('client-address').value,
        cnh: document.getElementById('client-cnh').value
    };
    
    const paymentMethod = paymentMethodSelect.value;
    
    // Validação básica
    if (!vehicleId || !pickupDate || !returnDate || !totalValue || 
        !clientData.name || !clientData.cpf || !clientData.email || 
        !clientData.phone || !clientData.address || !clientData.cnh || 
        !paymentMethod) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    
    // Encontra o veículo
    const vehicle = vehicles.find(v => v.id === vehicleId);
    
    // Cria a reserva
    const reservation = {
        id: reservations.length + 1,
        vehicleId: vehicleId,
        clientData: clientData,
        pickupDate: pickupDate,
        returnDate: returnDate,
        totalValue: totalValue,
        paymentMethod: paymentMethod,
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    // Adiciona à lista de reservas
    reservations.push(reservation);
    
    // Adiciona cliente (simulação)
    clients.push({
        id: clients.length + 1,
        ...clientData
    });
    
    // Marca veículo como reservado
    vehicle.status = 'reserved';
    updateVehicleDropdown();
    
    // Mostra página de confirmação
    showConfirmationPage(reservation, vehicle);
}

function showConfirmationPage(reservation, vehicle) {
    // Formata datas
    const pickupDate = new Date(reservation.pickupDate).toLocaleDateString('pt-BR');
    const returnDate = new Date(reservation.returnDate).toLocaleDateString('pt-BR');
    
    // Preenche detalhes da reserva
    reservationDetails.innerHTML = `
        <h3>Detalhes da Reserva</h3>
        <p><strong>Número da Reserva:</strong> #${reservation.id}</p>
        <p><strong>Veículo:</strong> ${vehicle.brand} ${vehicle.model}</p>
        <p><strong>Placa:</strong> ${vehicle.plate}</p>
        <p><strong>Período:</strong> ${pickupDate} a ${returnDate}</p>
        <p><strong>Valor Total:</strong> ${reservation.totalValue}</p>
        
        <h3>Dados do Cliente</h3>
        <p><strong>Nome:</strong> ${reservation.clientData.name}</p>
        <p><strong>CPF:</strong> ${reservation.clientData.cpf}</p>
        <p><strong>CNH:</strong> ${reservation.clientData.cnh}</p>
        <p><strong>Contato:</strong> ${reservation.clientData.phone}</p>
        <p><strong>E-mail:</strong> ${reservation.clientData.email}</p>
        
        <h3>Forma de Pagamento</h3>
        <p>${getPaymentMethodName(reservation.paymentMethod)}</p>
    `;
    
    showPage('confirmation');
}

function getPaymentMethodName(method) {
    switch(method) {
        case 'credit': return 'Cartão de Crédito';
        case 'debit': return 'Cartão de Débito';
        case 'pix': return 'PIX';
        default: return method;
    }
}

function processLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        alert(`Bem-vindo, ${user.username}! (Tipo: ${user.type})`);
        // Aqui você poderia redirecionar para uma área administrativa
        showPage('home');
    } else {
        alert('Usuário ou senha incorretos.');
    }
    
    // Limpa o formulário
    forms.login.reset();
}
