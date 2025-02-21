'use client';
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/authContext";

export default function Login() {
    const router = useRouter();
    const { login } = useAuth(); // Use the login function from AuthContext
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
        setError(''); // Clear error when user starts typing
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await login(formData.email, formData.password); // Use the login function from AuthContext
            router.push("/dashboard"); // Redirect to dashboard on successful login
        } catch (error) {
            setError(error.message); // Display error message if login fails
        }
    };

    return (
        <div className="flex flex-col lg:flex-row w-screen min-h-screen max-h-screen overflow-clip">
            {/* Image Section */}
            <section className="lg:flex-grow-[2] lg:h-screen flex justify-center items-center p-4 relative">
                <Image
                    src="/login-cover.png"
                    alt="Login Cover"
                    width={300}
                    height={300}
                    className="w-full max-w-[450px]"
                />
                <div className="absolute bottom-10 left-14">
                    <Image
                        src="/tree.png"
                        alt="Tree"
                        width={80}
                        height={80}
                    />
                </div>
                <div className="absolute bottom-0 translate-y-1/2 -rotate-12 bg-gray-200 w-screen h-1/2 -z-10">
                </div>
            </section>

            {/* Form Section */}
            <section className="bg-white lg:flex-grow lg:h-screen lg:min-w-[350px] flex justify-center items-center p-4">
                <div className="w-full max-w-[380px]">
                    <h1 className="text-2xl font-semibold text-left mb-1">Welcome to Dashboard! 👋</h1>
                    <p className="text-sm text-gray-600 text-left mb-4">
                        Please sign-in to your account and start the adventure
                    </p>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="rounded-2xl p-6 pl-0 pt-0 w-full">
                        {/* Email or Username */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder=" "
                                className="peer w-full px-4 pt-4 pb-2 bg-white text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
                            />
                            <label
                                htmlFor="email"
                                className={`absolute text-sm transition-all bg-white ${formData.email ? 'top-0 left-2 px-2 text-primary text-sm' : 'left-4 top-1/2 -translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base'} peer-focus:top-0 peer-focus:left-2 peer-focus:px-2 peer-focus:text-sm peer-focus:text-primary`}
                            >
                                Email or Username
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative mb-4">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder=" "
                                className="peer w-full px-4 pt-4 pb-2 text-sm border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
                            />
                            <label
                                htmlFor="password"
                                className={`absolute text-sm transition-all bg-white ${formData.password ? 'top-0 left-2 px-2 text-primary text-sm' : 'left-4 top-1/2 -translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base'} peer-focus:top-0 peer-focus:left-2 peer-focus:px-2 peer-focus:text-sm peer-focus:text-primary`}
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        {/* Remember Me */}
                        <div className="mb-4 flex items-center pl-1">
                            <input
                                type="checkbox"
                                id="remember"
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                            />
                            <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                                Remember Me
                            </label>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full py-2 text-sm text-white bg-primary rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}