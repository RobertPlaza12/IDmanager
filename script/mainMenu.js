//import API_CONFIG from "apiConfig.js";

async function cargarMenu() {
    try {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MAINMENU;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const menuData = await response.json();

        // Función para crear elementos del menu
        function createMenuItem(item, isSectionTitle = false) {
            if (isSectionTitle) {
                const titleElement = document.createElement('div');
                titleElement.className = 'menu-section-title';
                titleElement.textContent = item;
                return titleElement;
            }
            
            const menuItem = document.createElement('a');
            menuItem.href = item.url || '#';
            menuItem.className = 'menu-item';
            if (item.active) menuItem.classList.add('active');
            menuItem.setAttribute('data-id', item.id);
            
            // Hace el contenedor de la imagen o icono
            const iconElement = document.createElement('div');
            iconElement.className = 'menu-icon';
            iconElement.innerHTML = `<i class="${item.icon}"></i>`;
            
            // Hace el texto del menu
            const textElement = document.createElement('span');
            textElement.className = 'menu-text';
            textElement.textContent = item.name;
            
            // Agregar elementos al item del menu
            menuItem.appendChild(iconElement);
            menuItem.appendChild(textElement);
            
            return menuItem;
        }

        // Función para llenar los menus
        function populateMenus(data) {
            const menu = document.getElementById('menu');
            
            if (!menu) {
                console.error('Elemento #menu no encontrado');
                return;
            }
            
            menu.innerHTML = '';
            
            // Agregar titulo de sección al menu principal
            const mainTitle = createMenuItem('IDmanager', true);
            menu.appendChild(mainTitle);
            
            // Llenar menu principal
            data.mainMenu.forEach(item => {
                const menuItem = createMenuItem(item);
                menu.appendChild(menuItem);
            });
            
            // Agregar event listeners a los items del menu
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', function(e) {
                    // Remover clase active de todos los items
                    document.querySelectorAll('.menu-item').forEach(i => {
                        i.classList.remove('active');
                    });
                    
                    // Agregar clase active al item clickeado
                    this.classList.add('active');
                    
                    // Cerrar menu despues de seleccionar una opción
                    if (window.innerWidth <= 576) {
                        const menuContainer = document.querySelector('.mainMenu-container');
                        const body = document.body;
                        
                        if (menuContainer.classList.contains('expanded')) {
                            menuContainer.classList.remove('expanded');
                            body.classList.remove('menu-expanded');
                        }
                    }
                });
            });
        }

        // Función para manejar el botón de expandir menu
        function setupExpandButton() {
            const expandBtn = document.getElementById('expandBtn');
            const menuContainer = document.querySelector('.mainMenu-container');
            const body = document.body;
            
            if (!expandBtn) {
                console.error('ERROR: Botón #expandBtn no encontrado');
                return;
            }
            
            if (!menuContainer) {
                console.error('ERROR: .mainMenu-container no encontrado');
                return;
            }
            
            // Remover event listeners anteriores si existen
            expandBtn.replaceWith(expandBtn.cloneNode(true));
            const newExpandBtn = document.getElementById('expandBtn');
            
            newExpandBtn.addEventListener('click', function() {
                console.log('Botón clickeado!');
                menuContainer.classList.toggle('expanded');
                body.classList.toggle('menu-expanded');
            });
        }

        // Función para resaltar página actual
        function highlightCurrentPage() {
            // Obtener la página actual
            const currentPath = window.location.pathname;
            let currentPage = currentPath.split('/').pop();
            
            // Si estamos en la raíz, usar index.html
            if (!currentPage || currentPage === '') {
                currentPage = 'index.html';
            }
            
            const pageName = currentPage.replace('.html', '');
            
            console.log('Página actual detectada:', currentPage, 'Nombre:', pageName);
            
            // Limpiar todas las clases active
            document.querySelectorAll('.menu-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Buscar y marcar el elemento correspondiente
            document.querySelectorAll('.menu-item').forEach(item => {
                const href = item.getAttribute('href');
                
                // Verificar coincidencia exacta o por nombre de página
                if (href === currentPage || 
                    href === pageName || 
                    href === `/${currentPage}` ||
                    (href.includes(currentPage) && !href.includes('#')) ||
                    (href.includes(pageName) && !href.includes('#'))) {
                    
                    console.log('Marcando como activo:', href);
                    item.classList.add('active');
                }
            });
            
            // Si no se encontro ninguno activo, marcar el primero
            const activeItems = document.querySelectorAll('.menu-item.active');
            if (activeItems.length === 0 && data.mainMenu.length > 0) {
                const firstItem = document.querySelector('.menu-item');
                if (firstItem) {
                    firstItem.classList.add('active');
                }
            }
        }
        function setupMenuClickHandlers() {
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', function(e) {

                    // timer para asegurar que la navegación ocurra
                    setTimeout(() => {
                        highlightCurrentPage();
                    }, 100);
                    
                    // Cerrar menu 
                    if (window.innerWidth <= 576) {
                        const menuContainer = document.querySelector('.mainMenu-container');
                        const body = document.body;
                        
                        if (menuContainer.classList.contains('expanded')) {
                            menuContainer.classList.remove('expanded');
                            body.classList.remove('menu-expanded');
                        }
                    }
                });
            });
        }

        populateMenus(menuData);
        setupExpandButton();
        highlightCurrentPage();
        setupMenuClickHandlers();
        
        // Verificar periódicamente la página actual por si hay navegación SPA
        setInterval(highlightCurrentPage, 1000);
        
        // Manejar redimensionamiento de ventana
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 576) {
                const menuContainer = document.querySelector('.mainMenu-container');
                const body = document.body;
                
                if (menuContainer.classList.contains('expanded')) {
                    menuContainer.classList.remove('expanded');
                    body.classList.remove('menu-expanded');
                }
            }
        });
        
    } catch (error) {
        console.error("Error cargando el menu:", error);
    }
}

document.addEventListener('DOMContentLoaded', cargarMenu);