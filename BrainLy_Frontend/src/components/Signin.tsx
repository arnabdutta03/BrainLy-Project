import { useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

interface ErrorResponse {
    success: boolean;
    message: string;
    type?: string;
}

const Signin = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const unauthorized = location.state?.message === "Unauthorized";

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState(unauthorized ? "Please sign in to continue." : "");

    const timerRef = useRef<number | null>(null);

    const showError = (message: string) => {
        setError(message)

        if (timerRef.current)
            clearTimeout(timerRef.current)

        timerRef.current = window.setTimeout(() => {
            setError("");
        }, 2500);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email");
        const password = formData.get("password");

        const emailValue = typeof email === "string" ? email.trim() : "";
        const passwordValue = typeof password === "string" ? password.trim() : "";

        if (!emailValue || !passwordValue) {
            showError("Email and password are required.");
            return;
        }


        setLoading(true);

        try {
            const { data } = await axios.post("http://localhost:3000/api/v1/signin",
                {
                    email: emailValue.trim(),
                    password: passwordValue.trim(),
                },
                {
                    withCredentials: true,
                }
            );

            if (data.success)
                navigate("/main", { replace: true });

        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            showError(
                error.response?.data?.message ??
                "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="center" className="min-h-screen flex items-center justify-center px-4" >
            <div className="w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-lg border border-violet-900/30 rounded-2xl p-8 shadow-2xl">

                    <div className="text-center mb-5">
                        <h1 className="text-4xl font-bold text-white">
                            Welcome to BrainLy
                        </h1>

                        <p className="mt-4 text-gray-300 text-lg">
                            Great to see you again!
                        </p>
                    </div>

                    <form
                        className="space-y-5"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="block text-gray-300 mb-2">
                                Email
                            </label>

                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                className="w-full rounded-lg border border-violet-900/40 bg-black/20 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">
                                Password
                            </label>

                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full rounded-lg border border-violet-900/40 bg-black/20 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/30"
                            />

                            {error && (
                                <p className="mt-2 text-sm text-red-500">
                                    {error}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-500 disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>

                        <div className="flex justify-center text-sm">
                            <button
                                type="button"
                                className="text-violet-400 hover:text-violet-300"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-700" />
                        <span className="text-gray-500 text-sm">
                            OR
                        </span>
                        <div className="flex-1 h-px bg-gray-700" />
                    </div>

                    <p className="text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-violet-400 hover:text-violet-300 font-medium"
                        >
                            Sign Up
                        </Link>
                    </p>

                </div>
            </div>
        </section>
    );
};

export default Signin;