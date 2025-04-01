import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2, Settings, VolumeX, Check } from 'lucide-react';

interface Song {
	title: string;
	artist: string;
	url: string;
}

interface TimerSettings {
	workMinutes: number;
	breakMinutes: number;
}

const lofiPlaylist: Song[] = [
	{
		title: "Coding Night",
		artist: "LoFi Dreamer",
		url: "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"
	},
	{
		title: "Lofi Beats",
		artist: "arbrasbeats",
		url: "https://cdn.pixabay.com/download/audio/2023/09/07/audio_f8443307ae.mp3"
	},
	{
		title: "Happy Thoughtful Song",
		artist: "SUNRIZISH",
		url: "https://cdn.pixabay.com/download/audio/2022/01/20/audio_f8d39752db.mp3"
	},
	{
		title: "Good Night - Lofi Cozy Chill",
		artist: "FASSounds",
		url: "https://cdn.pixabay.com/download/audio/2023/07/30/audio_e0908e8569.mp3"
	},
	{
		title: "Lofi Beats",
		artist: "arbrasbeats",
		url: "https://cdn.pixabay.com/download/audio/2023/09/07/audio_f8443307ae.mp3"
	},
	{
		title: "Happy Thoughtful Song",
		artist: "SUNRIZISH",
		url: "https://cdn.pixabay.com/download/audio/2022/01/20/audio_f8d39752db.mp3"
	}
];

const predefinedGradients = [
	{ name: 'Purple Dream', classes: 'from-indigo-900 via-purple-900 to-pink-900' },
	{ name: 'Ocean Breeze', classes: 'from-blue-900 via-blue-700 to-cyan-500' },
	{ name: 'Sunset Vibes', classes: 'from-orange-700 via-pink-700 to-rose-700' },
	{ name: 'Forest Mist', classes: 'from-green-900 via-emerald-800 to-teal-700' },
];

function App() {
	const [timeLeft, setTimeLeft] = useState(25 * 60);
	const [isRunning, setIsRunning] = useState(false);
	const [isWorkTime, setIsWorkTime] = useState(true);
	const [currentSong, setCurrentSong] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio] = useState(new Audio(lofiPlaylist[0].url));
	const [volume, setVolume] = useState(0.5);
	const [showSettings, setShowSettings] = useState(false);
	const [timerSettings, setTimerSettings] = useState<TimerSettings>({
		workMinutes: 25,
		breakMinutes: 5
	});
	const [selectedGradient, setSelectedGradient] = useState(predefinedGradients[0]);
	const [customGradient, setCustomGradient] = useState({
		from: '#312e81',
		via: '#581c87',
		to: '#831843'
	});
	const [useCustomGradient, setUseCustomGradient] = useState(false);

	// Sound effects
	const startSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/24/audio_c8c8a73467.mp3');
	const endSound = new Audio('https://cdn.pixabay.com/download/audio/2022/03/19/audio_c8c4b3dc01.mp3');

	useEffect(() => {
		let interval: number;

		if (isRunning && timeLeft > 0) {
			interval = setInterval(() => {
				setTimeLeft((time) => time - 1);
			}, 1000);
		} else if (timeLeft === 0) {
			endSound.play();
			setIsWorkTime(!isWorkTime);
			setTimeLeft(isWorkTime ? timerSettings.breakMinutes * 60 : timerSettings.workMinutes * 60);
			setIsRunning(false);
		}

		return () => clearInterval(interval);
	}, [isRunning, timeLeft, isWorkTime, timerSettings]);

	useEffect(() => {
		audio.addEventListener('ended', nextSong);
		audio.volume = volume;
		return () => {
			audio.removeEventListener('ended', nextSong);
		};
	}, [audio, volume]);

	const toggleTimer = () => {
		if (!isRunning && timeLeft === (isWorkTime ? timerSettings.workMinutes * 60 : timerSettings.breakMinutes * 60)) {
			startSound.play();
		}
		setIsRunning(!isRunning);
	};

	const resetTimer = () => {
		setTimeLeft(isWorkTime ? timerSettings.workMinutes * 60 : timerSettings.breakMinutes * 60);
		setIsRunning(false);
	};

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	const togglePlay = () => {
		if (isPlaying) {
			audio.pause();
		} else {
			audio.play();
		}
		setIsPlaying(!isPlaying);
	};

	const nextSong = () => {
		const next = (currentSong + 1) % lofiPlaylist.length;
		audio.src = lofiPlaylist[next].url;
		setCurrentSong(next);
		if (isPlaying) audio.play();
	};

	const prevSong = () => {
		const prev = currentSong === 0 ? lofiPlaylist.length - 1 : currentSong - 1;
		audio.src = lofiPlaylist[prev].url;
		setCurrentSong(prev);
		if (isPlaying) audio.play();
	};

	const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newVolume = parseFloat(e.target.value);
		setVolume(newVolume);
		audio.volume = newVolume;
	};

	const toggleMute = () => {
		if (volume > 0) {
			audio.volume = 0;
			setVolume(0);
		} else {
			audio.volume = 0.5;
			setVolume(0.5);
		}
	};

	const getBackgroundClasses = () => {
		if (useCustomGradient) {
			return `bg-gradient-to-br`;
		}
		return `bg-gradient-to-br ${selectedGradient.classes}`;
	};

	const getCustomGradientStyle = () => {
		if (useCustomGradient) {
			return {
				background: `linear-gradient(to bottom right, ${customGradient.from}, ${customGradient.via}, ${customGradient.to})`
			};
		}
		return {};
	};

	return (
		<div
			className={`min-h-screen flex items-center justify-center p-4 ${getBackgroundClasses()}`}
			style={getCustomGradientStyle()}
		>
			{showSettings && <div onClick={() => setShowSettings(!showSettings)} className='fixed left-0 top-0 bg-black/10 size-full z-20'></div>}
			<div className="max-w-md w-full space-y-8 relative">
				{/* Settings Button */}
				<div className="flex justify-end relative z-30">
					<button
						onClick={() => setShowSettings(!showSettings)}
						className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-all"
					>
						<Settings size={24} />
					</button>
				</div>

				{/* Settings Panel */}
				{showSettings && (
					<div className="bg-white/10 backdrop-blur-lg w-full rounded-2xl h-full p-6 shadow-xl mb-4 absolute z-30 right-0 top-5">
						<h2 className="text-2xl font-bold text-white mb-4">Settings</h2>

						{/* Timer Settings */}
						<div className="space-y-4 mb-6">
							<div>
								<label className="text-white text-sm mb-1 block">Work Duration (minutes)</label>
								<input
									type="number"
									value={timerSettings.workMinutes}
									onChange={(e) => setTimerSettings(prev => ({
										...prev,
										workMinutes: parseInt(e.target.value)
									}))}
									className="w-full bg-white/20 text-white rounded-lg p-2"
									min="1"
									max="60"
								/>
							</div>
							<div>
								<label className="text-white text-sm mb-1 block">Break Duration (minutes)</label>
								<input
									type="number"
									value={timerSettings.breakMinutes}
									onChange={(e) => setTimerSettings(prev => ({
										...prev,
										breakMinutes: parseInt(e.target.value)
									}))}
									className="w-full bg-white/20 text-white rounded-lg p-2"
									min="1"
									max="30"
								/>
							</div>
						</div>

						{/* Theme Settings */}
						<div className="space-y-4">
							<h3 className="text-white font-semibold">Theme</h3>
							<div className="grid grid-cols-2 gap-2">
								{predefinedGradients.map((gradient) => (
									<button
										key={gradient.name}
										onClick={() => {
											setSelectedGradient(gradient);
											setUseCustomGradient(false);
										}}
										className={`p-2 rounded-lg text-white text-sm ${selectedGradient === gradient && !useCustomGradient
											? 'bg-white/30'
											: 'bg-white/10 hover:bg-white/20'
											}`}
									>
										{gradient.name}
									</button>
								))}
							</div>

							{/* Custom Gradient */}
							<div className="space-y-2">
								<label className="flex items-center space-x-2">
									<input
										type="checkbox"
										checked={useCustomGradient}
										onChange={(e) => setUseCustomGradient(e.target.checked)}
										className="rounded"
									/>
									<span className="text-white text-sm">Use Custom Gradient</span>
								</label>
								{useCustomGradient && (
									<div className="grid grid-cols-3 gap-2">
										<div>
											<label className="text-white text-xs block mb-1">From</label>
											<input
												type="color"
												value={customGradient.from}
												onChange={(e) => setCustomGradient(prev => ({
													...prev,
													from: e.target.value
												}))}
												className="w-full h-8 rounded"
											/>
										</div>
										<div>
											<label className="text-white text-xs block mb-1">Via</label>
											<input
												type="color"
												value={customGradient.via}
												onChange={(e) => setCustomGradient(prev => ({
													...prev,
													via: e.target.value
												}))}
												className="w-full h-8 rounded"
											/>
										</div>
										<div>
											<label className="text-white text-xs block mb-1">To</label>
											<input
												type="color"
												value={customGradient.to}
												onChange={(e) => setCustomGradient(prev => ({
													...prev,
													to: e.target.value
												}))}
												className="w-full h-8 rounded"
											/>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				)}

				{/* Timer Section */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-xl">
					<div className="text-center">
						<h1 className="text-4xl font-bold text-white mb-2">
							{isWorkTime ? 'Focus Time' : 'Break Time'}
						</h1>
						<div className="text-7xl font-bold text-white my-8 font-mono">
							{formatTime(timeLeft)}
						</div>
						<div className="flex justify-center space-x-4">
							<button
								onClick={toggleTimer}
								className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all"
							>
								{isRunning ? <Pause size={24} /> : <Play size={24} />}
							</button>
							<button
								onClick={resetTimer}
								className="bg-white/20 hover:bg-white/30 text-white rounded-full p-4 transition-all"
							>
								<SkipBack size={24} />
							</button>
						</div>
					</div>
				</div>

				{/* Music Player Section */}
				<div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-xl">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center space-x-3">
							<Music2 className="text-white" size={24} />
							<div>
								<h3 className="text-white font-medium">
									{lofiPlaylist[currentSong].title}
								</h3>
								<p className="text-white/70 text-sm">
									{lofiPlaylist[currentSong].artist}
								</p>
							</div>
						</div>
						<div className="flex items-center space-x-2">
							<button
								onClick={toggleMute}
								className="text-white/70 hover:text-white transition-colors"
							>
								{volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
							</button>
							<input
								type="range"
								min="0"
								max="1"
								step="0.01"
								value={volume}
								onChange={handleVolumeChange}
								className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
							/>
						</div>
					</div>

					<div className="flex justify-center space-x-6 mt-4">
						<button
							onClick={prevSong}
							className="text-white/70 hover:text-white transition-colors"
						>
							<SkipBack size={24} />
						</button>
						<button
							onClick={togglePlay}
							className="bg-white/20 hover:bg-white/30 text-white rounded-full p-3 transition-all"
						>
							{isPlaying ? <Pause size={24} /> : <Play size={24} />}
						</button>
						<button
							onClick={nextSong}
							className="text-white/70 hover:text-white transition-colors"
						>
							<SkipForward size={24} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;