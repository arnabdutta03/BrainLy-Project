import { useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";


interface Content {
    _id: string;
    title: string;
    link: string;
    tags: string[];
}

const Main = () => {

    const navigate = useNavigate()
    // const cardDiv = useRef<HTMLDivElement | null>(null);

    const [contents, setContents] = useState<Content[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get("http://localhost:3000/api/v1/content",
                    {
                        withCredentials: true,
                    }
                );

                if (data.success) {
                    setContents(data.contents ?? []);
                }
            } catch (err) {
                if (isAxiosError(err)) {
                    if (err.response?.status === 401 || err.response?.data.message === 'Unauthorized') {
                        navigate("/signin", {
                            state: {
                                message: "Unauthorized",
                            }
                        });
                    } else {
                        console.log(err.response?.data);
                    }
                } else {
                    console.error(err);
                }
            }
        };

        fetchData();
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-12">
            <h1 className="mb-22 text-center text-5xl font-extrabold text-white">
                Here's Your Thoughts 💭
            </h1>

            <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {contents.map((content) => (
                    <div
                        key={content._id}
                        className="group flex h-[350px] flex-col rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:shadow-blue-500/20"
                    >
                        <div className="flex w-full">

                        </div>

                        <h2 className="line-clamp-2 text-center text-xl font-bold text-white">
                            {content.title}
                        </h2>
                        <p className="line-clamp-2 text-center text-xl font-bold text-white">
                            {content.description}
                        </p>

                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                            {content.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="rounded-full bg-blue-600/20 px-3 py-1 text-xs font-medium text-blue-300 ring-1 ring-blue-500/30"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex mt-auto pt-8 justify-center">
                            <a
                                href={content.link}
                                target="_blank"
                                className="min-w-min rounded-xl text-center bg-blue-600 py-2 px-4 font-semibold text-white transition hover:bg-blue-800">
                                View Resource
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default Main;