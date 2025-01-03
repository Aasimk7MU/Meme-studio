import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';

const MemeGenerator = ({ themeColor }) => {
    const [image, setImage] = useState(null);
    const [topText, setTopText] = useState('');
    const [bottomText, setBottomText] = useState('');
    const [fontSize, setFontSize] = useState(30);
    const [fontColor, setFontColor] = useState('#ffffff');
    const [filename, setFilename] = useState('');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("filters")
    const [filterSettings, setFilterSettings] = useState({
        brightness: 100,
        contrast: 100,
        grayscale: 0,
        blur: 0,
    });
    const [sticker, setSticker] = useState(null);
    const [borderColor, setBorderColor] = useState('#000000');
    const [borderWidth, setBorderWidth] = useState(3);
    const [fontStyle, setFontStyle] = useState('Impact');
    const [textShadow, setTextShadow] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const canvasRef = useRef(null);
    const previewCanvasRef = useRef(null);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setIsLoading(true);
            const reader = new FileReader();
            reader.onload = () => {
                setImage(reader.result)
                setIsLoading(false)
            };
            reader.readAsDataURL(file);
        }
    };

    const setCanvasDimensions = (canvas, img) => {
        canvas.width = img.width > 500 ? 500 : img.width;
        canvas.height = img.height > 500 ? 500 : img.height;
    };

    const applyFiltersAndDrawImage = (canvas, ctx, img, saveChanges = false) => {
        const { brightness, contrast, grayscale, blur } = filterSettings;
        ctx.filter = `brightness(${filterSettings.brightness}%) contrast(${filterSettings.contrast}%) grayscale(${filterSettings.grayscale}%) blur(${filterSettings.blur}px)`;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        if (saveChanges) {
            const updatedImage = canvas.toDataURL()
            setImage(updatedImage)
        }
    };

    const drawMemeText = (canvas) => {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            setCanvasDimensions(canvas, img);
            applyFiltersAndDrawImage(canvas, ctx, img)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px ${fontStyle}`;
            ctx.fillStyle = fontColor;
            ctx.textAlign = 'center';
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';

            if (textShadow) {
                ctx.shadowColor = 'black';
                ctx.shadowBlur = 10;
            }
            if (topText) {
                const topTextY = Math.max(fontSize * 1.2, fontSize);
                ctx.strokeText(topText, canvas.width / 2, topTextY);
                ctx.fillText(topText, canvas.width / 2, topTextY);
            }
            if (bottomText) {
                const bottomTextY = canvas.height - Math.max(fontSize / 2, 10);
                ctx.strokeText(bottomText, canvas.width / 2, bottomTextY);
                ctx.fillText(bottomText, canvas.width / 2, bottomTextY);
            }
            if (sticker) {
                const stickerImage = new Image();
                stickerImage.src = sticker;
                stickerImage.onload = () => {
                    ctx.drawImage(stickerImage, canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
                };
            }
            if (borderWidth) {
                ctx.lineWidth = borderWidth;
                ctx.strokeStyle = borderColor;
                ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }
        };
        img.src = image;
    };

    const handlePreview = () => {
        if (image) {
            setIsPreviewOpen(true);
        }
    };
    useEffect(() => {
        if (isPreviewOpen && image) {
            const canvas = previewCanvasRef.current;
            const ctx = canvas.getContext("2d");
            const img = new Image();

            img.onload = () => {
                setCanvasDimensions(canvas, img); // Adjust canvas dimensions
                applyFiltersAndDrawImage(canvas, ctx, img);
                drawMemeText(canvas); // Add top and bottom text
            };
            img.src = image; // Trigger image load
        }
    }, [isPreviewOpen, image, filterSettings, topText, bottomText, fontSize, fontColor]);

    const toggleFullScreen = () => {
        setIsFullScreen(!isFullScreen)
    }

    const handleDownload = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = filename ? `${filename}.png` : `meme${Date.now()}.png`
        link.href = canvas.toDataURL('image/png')
        link.click();
        setSuccessMessage(`${filename}.png Created Successfully!`);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterSettings((prev) => ({ ...prev, [name]: value }));
    };

    const resetCustomizations = () => {
        setTopText('');
        setBottomText('');
        setFontSize(30);
        setFontColor('#ffffff');
        setFilterSettings({ brightness: 100, contrast: 100, grayscale: 0, blur: 0 });
        setSticker(null);
        setBorderColor('#000000');
        setBorderWidth(3);
    };

    const handleStickerChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => setSticker(reader.result);
        reader.readAsDataURL(e.target.files[0]);
    };

    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const img = new Image();
            img.onload = () => {
                setCanvasDimensions(canvas, img);
                // Apply filters before drawing the image
                applyFiltersAndDrawImage(canvas, ctx, img);
                // Draw meme text
                drawMemeText(canvas);
            };
            img.src = image;
        }
    }, [image, filterSettings, topText, bottomText, fontSize, fontColor, sticker, borderColor, borderWidth, textShadow]);

    useEffect(() => {
        if (image) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawMemeText(canvas);
        }
    }, [fontStyle, fontSize, fontColor]);

    const shareOnSocialMedia = (platform) => {
        const canvas = canvasRef.current
        const dataUrl = canvas.toDataURL("image/png")

        const url = `https://${platform}.com/?text=Check out my meme!&url=${dataUrl}`
        window.open(url, "_blank")
    }

    return (
        <>
            <div className={`${isDarkMode ? "dark" : ""}`}>
                <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white border-b-red-400 border-solid" : "bg-gradient-to-r from-blue-300 via-pink-200 to-yellow-200"} m-4 rounded-lg`} style={{ backgroundColor: themeColor }}>
                    <Navbar darkMode={isDarkMode} />
                    <div className={`flex justify-end p-4 m-2 ${isDarkMode ? "opacity-100" : "opacity-80"}`}>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isDarkMode}
                                onChange={() => setIsDarkMode(!isDarkMode)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-400 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:bg-blue-600 transition-all duration-300"></div>
                            <div
                                className={`absolute left-[4px] top-[4px] w-4 h-4 bg-white border border-gray-300 rounded-full shadow-sm peer-checked:translate-x-5 peer-checked:border-blue-600 transition-transform duration-300`}
                            ></div>
                            <span className="ml-3 text-md   font-semibold  text-red-700 dark:text-neutral-400 dark:text-[17px]">
                                {isDarkMode ? "Dark Mode" : "Light Mode"}
                            </span>
                        </label>
                    </div>
                    <div className={`max-w-4xl mx-auto  ${isDarkMode ? "bg-gray-800 text-white" : "bg-orange-200"} p-8 rounded-lg shadow-lg`}>
                        <h1 className={`text-4xl font-extrabold leading-none tracking-tight text-center mb-10 m-[-10px] ${isDarkMode ? "text-amber-500" : "text-gray-800"}`}>Meme Studio</h1>
                        <h3 className={`text-xl font-medium leading-none tracking-tight text-center mb-8 m-[-24px] ${isDarkMode ? "text-amber-500" : "text-gray-800"}`}> <small>Create your own memes easily here</small> </h3>
                        {isLoading && (
                            <div className='flex justify-center mb-4'>
                                <div className='loader w-16 h-16 border-4 border-t-4 border-gray-400 rounded-full animate-spin'> </div>
                            </div>
                        )}
                        <div className="flex flex-wrap justify-center items-center space-x-4 mb-4">
                            <input type="file" accept="image/*, .gif" onChange={handleImageUpload} className={`${isDarkMode ? "text-amber-400" : ""}`} />
                            <input className='p-2 rounded-md border border-gray-400' type="text" placeholder="Enter Top Text" value={topText} onChange={(e) => setTopText(e.target.value)} />
                            <input className='p-2 rounded-md border border-gray-400' type="text" placeholder="Enter Bottom Text" value={bottomText} onChange={(e) => setBottomText(e.target.value)} />
                            <label className='flex items-center space-x-2'>
                                <span className={`${isDarkMode ? "text-amber-400 " : ""} text-lg`}>Font Size:</span>
                                <input className='p-2 rounded-md border border-gray-400' type="number" value={fontSize} onChange={(e) => setFontSize(e.target.value)} />
                            </label>
                            <label className='p-2 rounded-xl border border-gray-500 text-md'>
                                <span className={`${isDarkMode ? "text-amber-400 " : ""}`}>Font Color:</span>
                                <input className='p-1 rounded-md border border-gray-500' type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
                            </label>
                            <input className='p-2 rounded-md border border-gray-400' type="text" placeholder="Filename" value={filename} onChange={(e) => setFilename(e.target.value)} />
                        </div>

                        <div className="flex justify-between border-b mb-3 bg-transparent opacity-80 border-slate-400 border-solid text-cyan-500 text-lg p-2 rounded-xl">
                            <button className={`p-2 ${activeTab === 'filters' ? 'bg-gray-300' : ''} hover:bg-gray-950 hover:text-zinc-100 `} onClick={() => setActiveTab('filters')}>Filters</button>
                            <button className={`p-2 ${activeTab === 'text' ? 'bg-gray-300' : ''} hover:bg-gray-950 hover:text-zinc-100`} onClick={() => setActiveTab('text')}>Text Customization</button>
                            <button className={`p-2 ${activeTab === 'sticker' ? 'bg-gray-300' : ''}hover:bg-gray-950 hover:text-zinc-100`} onClick={() => setActiveTab('sticker')}>Stickers</button>
                            <button className={`p-2 ${activeTab === 'border' ? 'bg-gray-300' : ''}hover:bg-gray-950 hover:text-zinc-100`} onClick={() => setActiveTab('border')}>Borders</button>
                        </div>
                        {activeTab === 'filters' && (
                            <div className="flex justify-around mt-7 mb-3">
                                <label className={`p-1 ${isDarkMode ? "text-amber-300" : "text-gray-400"}`}>
                                    Brightness:
                                    <input
                                        type="range"
                                        name="brightness"
                                        min="0"
                                        max="200"
                                        value={filterSettings.brightness}
                                        onChange={handleFilterChange}
                                    />
                                </label>
                                <label className={`p-1 ${isDarkMode ? "text-amber-300" : "text-gray-400"}`}>
                                    Contrast:
                                    <input
                                        type="range"
                                        name="contrast"
                                        min="0"
                                        max="200"
                                        value={filterSettings.contrast}
                                        onChange={handleFilterChange}
                                    />
                                </label>
                                <label className={`p-1 ${isDarkMode ? "text-amber-300" : "text-gray-400"}`}>
                                    Grayscale:
                                    <input
                                        type="range"
                                        name="grayscale"
                                        min="0"
                                        max="100"
                                        value={filterSettings.grayscale}
                                        onChange={handleFilterChange}
                                    />
                                </label>
                                <label className={`p-1 ${isDarkMode ? "text-amber-300" : "text-gray-400"}`}>
                                    Blur:
                                    <input
                                        type="range"
                                        name="blur"
                                        min="0"
                                        max="10"
                                        value={filterSettings.blur}
                                        onChange={handleFilterChange}
                                    />
                                </label>
                            </div>
                        )}
                        {activeTab === 'text' && (
                            <div className='mb-3 flex justify-evenly items-center'>
                                <label className={`${isDarkMode ? "text-amber-400" : "text-black"} m-3 gap-2`}>
                                    Font Style:
                                    <select onChange={(e) => setFontStyle(e.target.value)} value={fontStyle}>
                                        <option value="Impact">Impact</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Comic Sans MS">Comic Sans MS</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Courier New">Courier New</option>
                                        <option value="Papyrus">Papyrus</option>
                                        <option value="Verdana">Verdana</option>
                                        <option value="Helvetica">Helvetica</option>
                                        <option value="BankGothic MD BT">BankGothic MD BT</option>
                                    </select>
                                </label>
                                <label className={`${isDarkMode ? "text-amber-400" : "text-black"} m-3 gap-2`}>
                                    Text Shadow:
                                    <input type="checkbox" checked={textShadow} onChange={(e) => setTextShadow(e.target.checked)} />
                                </label>
                            </div>
                        )}

                        {activeTab === 'sticker' && (
                            <div className='mb-5'>
                                <input type="file" accept="image/*" onChange={handleStickerChange} />
                            </div>
                        )}

                        {activeTab === 'border' && (
                            <div className='mb-5 flex items-center justify-evenly'>
                                <label className={`${isDarkMode ? "text-amber-400" : "text-black"} m-3  gap-2`}>
                                    <span className='m-4'>Border Width:</span>
                                    <input className={`${isDarkMode ? "text-teal-600" : "text-black"} text-lg`} type="number" value={borderWidth} onChange={(e) => setBorderWidth(e.target.value)} />
                                </label>
                                <label className={`${isDarkMode ? "text-amber-400" : "text-black"} m-3 gap-2`}>
                                    Border Color:
                                    <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} />
                                </label>
                            </div>
                        )}

                        <canvas ref={canvasRef} className="block mx-auto mb-4 border-2 border-dashed border-gray-600 bg-white rounded-md shadow-lg w-full h-auto"></canvas>

                        <div className="text-center flex justify-center items-center gap-4 m-6 p-4">
                            {image && (
                                <button
                                    id="btn"
                                    className="mr-4 p-2 rounded-lg bg-blue-500 text-white"
                                    onClick={handlePreview}
                                >
                                    Preview Meme
                                </button>
                            )}
                            <button id='btn' onClick={handleDownload} className="mr-4 p-2 rounded-lg bg-green-500 text-teal-400"> <i class='fas fas fa-file-download text-fuchsia-600  '></i> <span className='m-2'>Download Meme</span></button>
                            {image && (
                                <div className="relative group">
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to reset customizations?')) {
                                                resetCustomizations();
                                            }
                                        }}
                                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium text-sm rounded-lg shadow-md hover:from-red-600 hover:to-pink-600 hover:shadow-lg transition-transform duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
                                        aria-label="Reset customizations"
                                        role="button"
                                        tabIndex="0"
                                    >
                                        Reset
                                    </button>
                                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                                        Reset all customizations
                                    </div>
                                </div>
                            )}

                        </div>
                        <div className="flex justify-center gap-6 mt-6">
                            <button
                                id="filterbtn"
                                onClick={() => shareOnSocialMedia("twitter")}
                                className={`flex items-center justify-center w-12 h-12 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 hover:shadow-lg`}
                            >
                                <i className="fab fa-twitter"></i>
                            </button>
                            <button
                                id="filterbtn"
                                onClick={() => shareOnSocialMedia("Whatsapp")}
                                className="flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-md hover:bg-green-600 hover:shadow-lg "
                            >
                                <i className="fab fa-whatsapp"></i>
                            </button>
                            <button
                                id="filterbtn"
                                onClick={() => shareOnSocialMedia("Instagram")}
                                className="flex items-center justify-center w-12 h-12 bg-pink-500 text-white rounded-full shadow-md hover:bg-pink-600 hover:shadow-lg"
                            >
                                <i className="fab fa-instagram"></i>
                            </button>
                        </div>
                    </div>
                    {isPreviewOpen && (
                        <div
                            className={`fixed inset-0 flex items-center justify-center ${isFullScreen ? 'bg-black' : 'bg-opacity-50'
                                }`}
                        >
                            <div className="bg-white p-6 rounded-lg shadow-xl">
                                <h2 className="text-lg font-bold mb-4">Meme Preview</h2>
                                <canvas
                                    ref={previewCanvasRef}
                                    className="transform transition-transform duration-500 hover:scale-110"
                                ></canvas>
                                <button
                                    onClick={toggleFullScreen}
                                    className="p-2 bg-gray-500 text-white rounded-lg mt-4"
                                >
                                    {isFullScreen ? 'Exit Full Screen' : 'Full Screen'}
                                </button>
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="p-2 bg-red-500 text-white rounded-lg mt-2 m-4"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="meme-creator-container">
                        {/* Success Message */}
                        {successMessage && (
                            <div className="success-message bg-green-500 text-white p-4 rounded-md shadow-md fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
                                {successMessage}
                            </div>
                        )}
                    </div>
                </div >
            </div>
        </>
    );
};

export default MemeGenerator;