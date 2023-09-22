import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [transactionType, setTransactionType] = useState('add'); // Default to 'add'

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function handleAddTransaction(event) {
    event.preventDefault();
    const price = parseFloat(name.split(' ')[0]);

    if (transactionType === 'add') {
      // Adding transaction
      addTransaction(price);
    } else if (transactionType === 'subtract') {
      // Subtracting transaction
      subtractTransaction(price);
    }
  }

  function addTransaction(price) {
    const url = process.env.REACT_APP_API_URL + '/transaction';
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, name: name.substring(price.toString().length + 1), description, datetime }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((json) => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('result', json);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  function subtractTransaction(price) {
    // Ensure that the price is negative
    const negativePrice = -Math.abs(price); // Convert price to a negative value
  
    // Make a request to your API to subtract the transaction
    const url = process.env.REACT_APP_API_URL + '/transaction'; // Use the same API endpoint as add
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: negativePrice, name: name.substring(price.toString().length + 1), description, datetime }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((json) => {
        setName('');
        setDatetime('');
        setDescription('');
        console.log('Subtract result:', json);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  
  

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);

  return (
    <main>
      <h1>
        {balance}
        <span>.00</span>
      </h1>
      <form onSubmit={handleAddTransaction}>
        <div className="basic">
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Name"
          />

          <input
            value={datetime}
            onChange={(ev) => setDatetime(ev.target.value)}
            type="datetime-local"
          />
        </div>

        <div className="description">
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="Description"
          />
        </div>
        <button type="button" onClick={() => setTransactionType('add')}>Add Transaction</button>
        <button type="button" onClick={() => setTransactionType('subtract')}>Subtract Transaction</button>
        <button type="submit">Submit</button>
      </form>
      <div className="transactions">
        {transactions.length > 0 &&
          transactions.map((transaction) => (
            <div className="transaction" key={transaction.id}>
              <div className="left">
                <div className="name">{transaction.name}</div>
                <div className="description">{transaction.description}</div>
              </div>
              <div className="right">
                <div className={'price ' + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className="datetime">2023-12-18 15:45</div>
              </div>
            </div>
          ))}
      </div>
    </main>
  );
}

export default App;
