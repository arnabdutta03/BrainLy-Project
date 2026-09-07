import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";



const Signup = () => {
    
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState(true);
    const [usernameVisiable, setUsernameVisiable] = useState(false);

    const [emailError, setEmailError] = useState('');
    const [emailVisiable, setEmailVisiable] = useState(false);


    const [passwordError, setPasswordError] = useState('');
    const [passwordVisiable, setPasswordVisiable] = useState(false);

    const usernameInp = useRef<HTMLInputElement>(null);
    const emailInp = useRef<HTMLInputElement>(null);
    const passwordInp = useRef<HTMLInputElement>(null);


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const username = usernameInp.current?.value.trim();
        const email = emailInp.current?.value.trim();
        const password = passwordInp.current?.value.trim();
        
        interface ErrorResponse {
            success: boolean;
            message: string;
            type?: string;
        }

        try {
            const response = await axios.post("http://localhost:3000/api/v1/signup", {
                username,
                email,
                password,
            });


            if (response?.data?.success === true) {
                navigate("/signin")
            }

        } catch (error) {
            const err = error as AxiosError<ErrorResponse>;

            console.log(err.response?.data);
            if (err.response?.data?.type === 'email') {
                setEmailError(err.response?.data?.message)
                setEmailVisiable(true)
                setTimeout(() => {
                    setEmailVisiable(false)
                }, 2000)
            }
            if (err.response?.data?.type === 'password') {
                setPasswordError(err.response?.data?.message)
                setPasswordVisiable(true)
                setTimeout(() => {
                    setPasswordVisiable(false)
                }, 2000)
            }

        }
    };

    const usernameCheck = async (name: string) => {

        const username = name;
        try {

            const response = await axios.post("http://localhost:3000/api/v1/username", {
                username,
            });

            if (response.data?.available) {
                setUsernameAvailable(true)
                setUsernameVisiable(true)
                setTimeout(() => {
                    setUsernameVisiable(false)
                }, 2000)
            } else {
                setUsernameAvailable(false)
                setUsernameVisiable(true);
            }

        } catch (error) {
            console.error(error);
        }
    };


    useEffect(() => {
        if (!username) return;

        if (username.length > 3) {
            const timer = setTimeout(() => {
                usernameCheck(username);
            }, 500);

            return () => clearTimeout(timer);
        }

    }, [username]);


    return (
        <section
            id="center"
            className="min-h-screen flex items-center justify-center px-4"
        >
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-lg border border-violet-900/30 rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-5">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome to BrainLy
                        </h1>

                        <p className="mt-4 text-gray-300 text-lg leading-relaxed">
                            Great to see you!
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Username */}
                        <div>

                            <div className="flex">
                                <label className="block text-gray-300 mb-2">
                                    Username
                                </label>

                                <p className={`${usernameVisiable ? "flex" : "hidden"} ml-1 mt-0.5 w-full text-sm font-medium ${usernameAvailable ? "text-green-600" : "text-red-700"}`}>
                                    {usernameAvailable ? " is available" : " already exists"}
                                </p>
                            </div>

                            <input
                                type="text"
                                ref={usernameInp}
                                value={username}
                                onChange={(e) => setUsername(e.target.value.trim())}
                                placeholder="johnwick007"
                                className="w-full rounded-lg border border-violet-900/40 bg-black/20 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                required
                            />


                        </div>

                        {/* Email */}
                        <div>
                            <div className="flex">
                                <label className="block text-gray-300 mb-2">
                                    Email
                                </label>

                            </div>

                            <input
                                type="email"
                                ref={emailInp}
                                placeholder="john@example.com"
                                className="w-full rounded-lg border border-violet-900/40 bg-black/20 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                required
                            />
                            <p className={`${emailVisiable ? "flex" : "hidden"} ml-1 mt-0.5 w-full text-sm font-medium text-red-700`}>{emailError}</p>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                ref={passwordInp}
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-violet-900/40 bg-black/20 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                                required
                            />
                            <p className={`${passwordVisiable ? "flex" : "hidden"} ml-1 mt-0.5 w-full text-sm font-medium text-red-700`}>{passwordError}</p>
                        </div>


                        {/* Login Button */}
                        <button
                            type="submit"
                            className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 active:scale-[0.98]"
                        >
                            Signup
                        </button>

                        {/* Options */}
                        <div className="flex items-center justify-center text-sm">

                            <a
                                href="#"
                                className="text-violet-400 hover:text-violet-300"
                            >
                                Forgot Password?
                            </a>

                        </div>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="h-px flex-1 bg-gray-700"></div>
                        <span className="text-gray-500 text-sm">
                            OR
                        </span>
                        <div className="h-px flex-1 bg-gray-700"></div>
                    </div>


                    {/* Footer */}
                    <p className="mt-8 text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            to="/signin"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Login
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
};

export default Signup;