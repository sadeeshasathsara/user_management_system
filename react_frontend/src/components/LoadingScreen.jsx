import React from 'react';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const LoadingScreen = ({ isLoading = true, onLoadingComplete }) => {
    const [showLoading, setShowLoading] = React.useState(isLoading);

    React.useEffect(() => {
        if (isLoading) {
            setShowLoading(true);
            const handleLoading = async () => {
                await wait(3000); // Wait 3 seconds after displaying loading
                setShowLoading(false);
                if (onLoadingComplete) {
                    onLoadingComplete();
                }
            };
            handleLoading();
        } else {
            setShowLoading(false);
        }
    }, [isLoading, onLoadingComplete]);

    if (!showLoading) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex items-center justify-center">
            {/* Main container */}
            <div className="relative flex flex-col items-center space-y-8">

                {/* Logo container with minimal design */}
                <div className="relative">
                    {/* Logo */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-blue-100 transform hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-2xl md:text-3xl tracking-wide">U</span>
                    </div>

                    {/* Subtle pulse effect */}
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-ping"></div>
                </div>

                {/* Modern loading indicator */}
                <div className="flex flex-col items-center space-y-6">

                    {/* Minimalist spinner */}
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-2 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-2 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    </div>

                    {/* Clean loading text */}
                    <div className="text-center">
                        <p className="text-gray-700 text-lg font-medium mb-2">Loading</p>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>

                    {/* Progress line */}
                    <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full animate-pulse"></div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoadingScreen;