'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { addNewDoctor, upDateDoctor } from '@/lib/api';
import CustomPopup from '@/app/components/customPopup';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import SuccessPopup from '@/app/components/popupCard';


export default function EditDoctor({ params }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = React.use(params);

    const userData = JSON.parse(searchParams.get('data'));

    const [successMessage, setSuccessMessage] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const [formData, setFormData] = useState({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
    });

    const [originalData, setOriginalData] = useState({ ...formData }); // Store original data
    const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
    const [showPopup, setShowPopup] = useState(false); // Toggle custom popup
    const [popupMessage, setPopupMessage] = useState(''); // Popup message
    const [popupAction, setPopupAction] = useState(null); // Popup action (callback)
    const [isFormModified, setIsFormModified] = useState(false); // Track if form is modified
    const [passwordError, setPasswordError] = useState(false);

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setFormData({ ...formData, password: value });

        if (!validatePassword(value)) {
            setPasswordError('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
        } else {
            setPasswordError('');
        }
    };

    // Show Popup
    const showSuccessMessage = (message) => {
        setIsPopupOpen(true)
        setSuccessMessage(message)
    }

    // Check if form data is modified
    useEffect(() => {
        const isModified = Object.keys(formData).some(
            (key) => formData[key] !== originalData[key]
        );
        setIsFormModified(isModified);
    }, [formData, originalData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const generatePassword = () => {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const specialChars = '!@#$%^&*_+-=:\\\|,./';

        const allChars = uppercase + lowercase + numbers + specialChars;
        let password = '';

        // Ensure at least one character from each category
        password += uppercase[Math.floor(Math.random() * uppercase.length)];
        password += lowercase[Math.floor(Math.random() * lowercase.length)];
        password += numbers[Math.floor(Math.random() * numbers.length)];
        password += specialChars[Math.floor(Math.random() * specialChars.length)];

        // Fill the rest of the password
        for (let i = 4; i < 12; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }

        // Shuffle the password to randomize the order
        password = password.split('').sort(() => Math.random() - 0.5).join('');

        setFormData({ ...formData, password });
        setPasswordError('');
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        return (
            password.length >= minLength &&
            hasUpperCase &&
            hasLowerCase &&
            hasNumber &&
            hasSpecialChar
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword(formData.password)) {
            setPasswordError('Please enter a strong password.');
            return;
        }

        try {
            const result = await upDateDoctor(id, formData);
            if (result) {
                showSuccessMessage('User Updated Successfully');
                setTimeout(() => {
                    router.back();
                }, 1500);
                return
            }
        } catch (error) {
            confirmAction(`Error: ${error}`, () => { });
        }
    };

    const handleDiscardChanges = () => {
        setFormData({ ...originalData }); // Restore original data
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 mt-[2%]">
            <div className='flex justify-start w-full p-2'>
                <button className='hover:bg-slate-300 rounded-full p-2' onClick={() => router.back()}>
                    <ChevronLeft className='text-black ' />
                </button>
            </div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full">
                <div className='flex justify-between items-center'>
                    <h2 className="text-2xl font-bold mb-6 text-start">Edit Doctor</h2>

                    {isFormModified && (
                        <button
                            type="button"
                            onClick={handleDiscardChanges}
                            className="mb-4 px-4 py-2  text-gray-700 hover:text-black border-black/40 hover:border-black rounded-md border-2"
                        >
                            Discard Changes
                        </button>
                    )}
                </div>

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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handlePasswordChange}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Enter your password or generate one"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="ml-2 px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-md shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                        <button
                            type="button"
                            onClick={generatePassword}
                            className="ml-2 px-3 py-2 bg-primary text-white text-sm font-medium rounded-md shadow hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Auto-generate
                        </button>
                    </div>
                    {passwordError && (
                        <p className="mt-2 text-sm text-red-600">{passwordError}</p>
                    )}
                    {/* <div className="mt-2 text-sm text-gray-600">
                        <p>Password must meet the following requirements:</p>
                        <ul className="list-disc list-inside">
                            <li>At least 8 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character</li>
                        </ul>
                    </div> */}
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
                </div>

                <button
                    type="submit"
                    disabled={!isFormModified} // Disable if form is not modified
                    className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    Save Changes
                </button>
            </form>

            <SuccessPopup
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                message={successMessage}
                autoCloseTime={1200} // Will auto close after 3 seconds
            />
        </div>
    );
}