//import API_CONFIG from "apiConfig.js";

async function cargarMenu() {
    try {
        const url = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.MAINMENU;
        const response = await fetch(url);
        
        //throw new Error(url);

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const menuData = await response.json();
        const menus = document.getElementById("menu");
        const ul = document.createElement("ul");

        menuData.forEach(item => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = item.nombre;
            a.href = item.url;
            
            li.appendChild(a);
            ul.appendChild(li);
        });

        menus.appendChild(ul);
    } catch (error) {
        console.error("Error cargando el menú:", error);
    }
}
cargarMenu();