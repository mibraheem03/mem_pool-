const WebSocket = require('ws');
const Web3 = require('web3');

const wsUrl = 'wss://api.speedynodes.net/ws/bsc-ws?apikey=3FYpmfOd77SNS1IkIZ2QzBAiDhWKiY0x';
const web3HttpUrl = 'https://api.speedynodes.net/http/bsc-http?apikey=3FYpmfOd77SNS1IkIZ2QzBAiDhWKiY0x';

const ws = new WebSocket(wsUrl);
const web3 = new Web3(new Web3.providers.HttpProvider(web3HttpUrl));

let startTime; // Variable to store the start time

ws.on('open', () => {
    console.log('WebSocket connection opened');
    // Subscribe to newPendingTransactions
    ws.send('{"jsonrpc": "2.0", "id": 1, "method": "eth_subscribe", "params": ["newPendingTransactions"]}');
    
    // Record the start time when the connection is opened
    startTime = new Date();
    // Display initial time
    displayElapsedTime();
});

ws.on('message', async (message) => {
    try {
        const response = JSON.parse(message);
        console.log(response);

        // Extract transaction hash
        const txHash = response.params.result;
       // console.log(txHash);

        // Fetch transaction details using web3.js
        const transactionDetails = await web3.eth.getTransaction(txHash);
        // console.log(transactionDetails);

    } catch (error) {
        console.error('Error parsing JSON:', error);
    } finally {
        // Display elapsed time after processing each message
        displayElapsedTime();
    }
});

ws.on('close', (code, reason) => {
    console.log(`WebSocket connection closed. Code: ${code}, Reason: ${reason}`);
    // Implement reconnection logic if needed
});

ws.on('error', (error) => {
    console.log('WebSocket error:', error.message);
});

// Function to calculate and display elapsed time
function displayElapsedTime() {
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime;
    const formattedTime = formatTime(elapsedTime);

    console.log(`Elapsed Time: ${formattedTime}`);
}

// Function to format milliseconds into hours, minutes, and seconds
function formatTime(milliseconds) {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m ${seconds}s`;
}
