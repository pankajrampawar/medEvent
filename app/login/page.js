'use client'
import Image from "next/image";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {

    const router = useRouter();
    const handleSubmit = (e) => {
        e.preventDefault();
        router.push("/dashboard");
    }

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
                    <h1 className="text-2xl font-semibold text-left mb-1 ">Welcome to Dashboard! 👋</h1>
                    <p className="text-sm text-gray-600 text-left mb-4">
                        Please sign-in to your account and start the adventure
                    </p>
                    <form onSubmit={handleSubmit} className="rounded-2xl p-6 pl-0 pt-0 w-full">
                        {/* Email or Username */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                id="email"
                                placeholder=" "
                                className="peer w-full px-4 pt-4 pb-2 bg-white text-sm border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 bg-white peer-focus:px-2 peer-focus:text-sm peer-focus:left-2 peer-focus:text-primary"
                            >
                                Email or Username
                            </label>
                        </div>

                        {/* Password */}
                        <div className="relative mb-4">
                            <input
                                type="password"
                                id="password"
                                placeholder=" "
                                className="peer w-full px-4 pt-4 pb-2 text-sm border-2 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:px-2 peer-focus:left-2 bg-white peer-focus:text-sm peer-focus:text-primary"
                            >
                                Password
                            </label>
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            >
                                <Eye size={20} />
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