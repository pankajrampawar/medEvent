import { CheckCircleIcon } from "lucide-react";

const SuccessMessage = ({ onContinue }) => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
            <div className="bg-white shadow-lg rounded-2xl p-6 text-center max-w-sm">
                <CheckCircleIcon className="text-green-500 w-16 h-16 mx-auto mb-4" />
                <h1 className="text-xl font-semibold text-gray-800 mb-2">
                    Form Submitted Successfully!
                </h1>
                <p className="text-gray-600 mb-4">
                    Thank you for submitting the form. We have received your details and will process them soon.
                </p>
            </div>
        </div>
    );
};

export default SuccessMessage;