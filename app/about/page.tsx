// pages/about.tsx

const AboutPage = () => {
    return (
        <div>
            <div className="bg-gray-100 pt-[200px] py-12 relative">
                {/* Top Left Line */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-orange-500"></div>

                {/* Top Right Line */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-orange-500"></div>

                <div className="container mx-auto px-4 text-center">
                    <div className="flex justify-center items-center mb-8 space-x-8">
                        <div className="bg-orange-500 text-white py-2 px-4 rounded-full text-lg font-semibold">
                            10+ Years of experience
                        </div>
                        <div className="text-6xl font-bold text-black">Amo</div>
                        <div className="bg-orange-500 text-white py-2 px-4 rounded-full text-lg font-semibold">
                            300+ Projects
                        </div>
                    </div>
                    <p className="text-lg text-gray-600 mb-8">We are a group of experts in home decoration</p>
                </div>
            </div>



            <div className="bg-gray-100 p-6">
                <div className="flex justify-center mb-4">
                    <img
                        src="/images/01_pd_focus_atlasconcorde.jpg"
                        alt="Small Image"
                        className="w-[350px] h-[350px] object-cover rounded-lg"
                    />
                    <div className="p-6">
                        <div className="flex items-center space-x-4">

                            <div className="p-6">
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                                        2010
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-800 mb-4">Established in</p>
                                        <p className=" text-2xl font-bold text-gray-800 mb-4">by a group of experts in home decoration who has a comprehensive and deep knowledge in decoration materials, interior design and home items.</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
                <img
                    src="/images/01_pd_focus_atlasconcorde.jpg"
                    alt="Small Image"
                    className="w-[350px] h-[350px] object-cover rounded-lg"
                />
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between space-x-6">
                    <div className="md:w-1/2 pl-4">
                        <p className="text-2xl font-bold text-gray-800 mb-4">
                            Amo Co.,Ltd. focuses on delivering the
                            <span className="text-yellow-500"> HIGHEST QUALITY </span>
                            of products and services to our customers as we have different types of products for all design both modern and classic. Apart from decoration and design, Amo is also a reliable counselor in selecting goods of design that meet the clients' requirements and budget.
                        </p>
                    </div>
                    <div className="md:w-1/2 mb-4 md:mb-0">
                        <img
                            src="/images/01_pd_focus_atlasconcorde.jpg"
                            alt="Large Image"
                            className="w-full h-[500px] object-cover rounded-lg"
                        />
                    </div>


                </div>
            </div>
        </div>
    );
}

export default AboutPage;
