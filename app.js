// Элементы управления
const connectButton = document.getElementById("connectWallet");
const walletAddress = document.getElementById("walletAddress");
const statusMessage = document.getElementById("status");
let currentProvider;

// Функция для проверки подключения
async function checkConnection() {
    if (!window.ethereum) {
        setStatus("MetaMask не установлен! Пожалуйста, установите расширение.", true);
        return;
    }

    try {
        currentProvider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = currentProvider.getSigner();
        const address = await signer.getAddress();
        updateUI(address);
    } catch (error) {
        console.log("Кошелёк не подключён или отклонён пользователем.", error);
    }
}

// Функция подключения MetaMask
async function connectWallet() {
    if (!window.ethereum) {
        setStatus("MetaMask не установлен! Пожалуйста, установите расширение.", true);
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length === 0) {
            throw new Error("Кошелёк не выбран.");
        }

        const address = accounts[0];
        currentProvider = new ethers.providers.Web3Provider(window.ethereum);
        updateUI(address);
        setStatus("Успешное подключение!", false);
    } catch (error) {
        console.log("Ошибка подключения к MetaMask:", error);
        setStatus("Ошибка подключения: " + error.message, true);
    }
}

// Функция обновления интерфейса
function updateUI(address) {
    walletAddress.innerText = `Wallet: ${address.slice(0, 6)}...${address.slice(-4)}`;
    connectButton.innerText = 'Connected with MetaMask';
    connectButton.disabled = true;
    connectButton.style.backgroundColor = "#3e8e41"; // Зелёный цвет для статуса подключения
}

// Функция установки сообщения статуса
function setStatus(message, isError) {
    statusMessage.innerText = message;
    statusMessage.style.color = isError ? "#f44336" : "#3e8e41"; // Красный для ошибок, зелёный для успеха
}

// Проверка подключения при загрузке страницы
window.addEventListener('load', checkConnection);

// Обработчик события для кнопки
connectButton.addEventListener("click", connectWallet);

// Эффект наклона контейнера при движении мыши
const container = document.querySelector('.container');
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const deltaX = (mouseX - centerX) / centerX;
    const deltaY = (mouseY - centerY) / centerY;

    const tiltX = deltaY * 10; // угол наклона по оси X
    const tiltY = -deltaX * 10; // угол наклона по оси Y

    container.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
});
