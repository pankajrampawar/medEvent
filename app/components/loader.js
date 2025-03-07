
const LoadingSpinner = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg text-gray-700">{message}</p>
        </div>
    );
};

export default LoadingSpinner;