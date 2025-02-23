import React from 'react';

const CustomPopup = ({ message, onYes, onNo }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-lg mb-4">{message}</p>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onNo}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                        No
                    </button>
                    <button
                        onClick={onYes}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-indigo-600"
                    >
                        Yes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomPopup;