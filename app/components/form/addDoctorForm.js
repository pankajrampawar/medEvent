'use client'
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AddDoctor() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: generateStrongPassword(),
        role: '',
    });

    const [showSuccess, setShowSuccess] = useState(false);

    const generatePassword = () => {
        const randomPassword = Math.random().toString(36).slice(-16); // Generates an 8-character random password
        setFormData({ ...formData, password: randomPassword });
    };

    function generateStrongPassword() {
        const length = 12;
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
        let password = "";
        for (let i = 0; i < length; i++) {
            password += charset.charAt(Math.floor(Math.random() * charset.length));
        }
        return password;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Simulate API call to add doctor to the database
        try {
            // Replace with your actual API endpoint
            const response = await fetch('/api/add-doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: generateStrongPassword(),
                    role: '',
                });
            } else {
                console.error('Failed to add doctor');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full">
                <h2 className="text-2xl font-bold mb-6 text-start">Add Doctor</h2>
                <div className='flex gap-4 w-full'>
                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    <div className="mb-4 w-full">
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <div className="mt-1 flex items-center">
                        <input
                            type="text"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password or generate one"
                        />
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="ml-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Auto-generate
                        </button>
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    >
                        <option value="" disabled>Select a role</option>
                        <option value="emt">EMT</option>
                        <option value="medic">Medic</option>
                        <option value="nppa">NP/PA</option>
                        <option value="usP">US Physicians</option>
                        <option value="interP">Inter Physician</option>
                    </select>
                </div>x

                <button
                    type="submit"
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-600  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Add Doctor
                </button>
            </form>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg"
                    >
                        Doctor added successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}