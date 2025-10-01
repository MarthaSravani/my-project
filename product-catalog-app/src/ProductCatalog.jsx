import React, { useState } from 'react';

export default function ProductCatalog() {
const [products, setProducts] = useState([
    { id: 1, name: 'Apple', price: 0.99 },
    { id: 2, name: 'Banana', price: 0.59 },
    { id: 3, name: 'Orange', price: 1.29 },
]);

const [name, setName] = useState('');
const [price, setPrice] = useState('');
const [error, setError] = useState('');

const nextId = () => {
    if (products.length === 0) return 1;
    return Math.max(...products.map((p) => p.id)) + 1;
};

const handleAdd = (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
setError('Product name is required.');
return;
    }
    const parsedPrice = parseFloat(price);
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
setError('Price must be a non-negative number.');
    return;
    }

    const newProduct = { id: nextId(), name: name.trim(), price: parsedPrice };
    setProducts((prev) => [...prev, newProduct]);

    setName('');
    setPrice('');
};

const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
};

return (
    <div className="max-w-3xl mx-auto p-4">
    <h1 className="text-2xl font-semibold mb-4">Product Catalog</h1>

    <div className="bg-white shadow rounded p-4 mb-6">
        <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Laptop"
            className="w-full border rounded px-2 py-1"
            />
        </div>

        <div>
            <label className="block text-sm font-medium mb-1">Price (USD)</label>
            <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g., 199.99"
            className="w-full border rounded px-2 py-1"
            />
        </div>

        <div>
            <button
            type="submit"
            className="w-full bg-indigo-600 text-white rounded py-2 px-3 hover:bg-indigo-700"
            >
            Add Product
            </button>
        </div>
        </form>

        {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>

    <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-medium mb-3">Products ({products.length})</h2>

        {products.length === 0 ? (
        <p className="text-gray-600">No products available.</p>
        ) : (
        <table className="w-full table-auto border-collapse">
            <thead>
            <tr className="text-left border-b">
                <th className="py-2">ID</th>
                <th className="py-2">Name</th>
                <th className="py-2">Price (USD)</th>
                <th className="py-2">Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((p) => (
                <tr key={p.id} className="border-b">
                <td className="py-2">{p.id}</td>
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.price.toFixed(2)}</td>
                <td className="py-2">
                    <button
                    onClick={() => handleDelete(p.id)}
                    className="text-sm bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                    Delete
                    </button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        )}
    </div>
    </div>
);
}
