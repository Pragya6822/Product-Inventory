import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', quantity: '' });
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ priceRange: '', availability: '' });

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products').then((response) => {
      const formattedProducts = response.data.map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: Math.floor(Math.random() * 20), // Adding random quantities for demo
      }));
      setProducts(formattedProducts);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId ? { ...product, ...form } : product
        )
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), ...form, quantity: parseInt(form.quantity) },
      ]);
    }
    setForm({ title: '', price: '', quantity: '' });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({ title: product.title, price: product.price, quantity: product.quantity });
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const filteredProducts = products.filter((product) => {
    const inPriceRange =
      !filters.priceRange || product.price <= parseFloat(filters.priceRange);
    const inAvailability =
      filters.availability === '' ||
      (filters.availability === 'low-stock' && product.quantity < 10);
    return inPriceRange && inAvailability;
  });

  return (
    <div className="App">
      <h1>Product Inventory System</h1>
      <form onSubmit={handleSubmit} className="product-form">
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          required
        />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <div className="filters">
        <label>
          Price Range:
          <input
            type="number"
            value={filters.priceRange}
            onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            placeholder="Max Price"
          />
        </label>
        <label>
          Availability:
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
          >
            <option value="">All</option>
            <option value="low-stock">Low Stock</option>
          </select>
        </label>
      </div>

      <div className="product-list">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`product-item ${product.quantity < 10 ? 'low-stock' : ''}`}
          >
            <h3>{product.title}</h3>
            <p>Price: ${product.price}</p>
            <p>Quantity: {product.quantity}</p>
            <button onClick={() => handleEdit(product)}>Edit</button>
            <button onClick={() => handleDelete(product.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;


