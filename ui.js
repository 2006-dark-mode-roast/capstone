"use strict";
const React = require("react");

const { useEffect, useState, useRef } = require("react");
const { Text, Box, measureElement, Newline, Spacer } = require("ink");

const Renderer = require("./components/Divider");
const Gradient = require("ink-gradient");
const BigText = require("ink-big-text");

const importJsx = require("import-jsx");
const Selector = importJsx("./Selector.js");
const Logo = importJsx("./components/Logo")

const gitBranchCall = require("./currentBranch");
const gitStatusPull = require('./actions/gitStatusPull')
const gitStatusProcess = require('./actions/gitStatusProcess')
const gitBranchVisualPull = require('./actions/gitBranchVisualPull')
const gitBranchVisualProcess = require('./actions/gitBranchVisualProcess')

const {showLogo, defaultColor, accentColor, gitTreeColor, appResize, changeBold, changeBorder} = require('./styleFile')

const App = () => {
	const [status, setStatus] = useState("");
	const [branch, setBranch] = useState("");
	const [visual, setVisual] = useState("");
	const [appWidth, setWidth] = useState(null);
	const [treeHeight, setTreeHeight] = useState(null)
	const [appheight, setHeight] = useState("50")

	const ref = useRef(null);

	useEffect(() => {
		const intervalStatusCheck = setInterval(() => {
			setStatus(gitStatusPull());
			setBranch(gitBranchCall());
			setVisual(gitBranchVisualPull());
			if (appResize) {setHeight(process.stdout.rows)}
			const { width, height } = measureElement(ref.current);
			setWidth(width);
			setTreeHeight(height)
		}, 1000);
		if (!appResize) {setHeight(process.stdout.rows)}

		return () => {
			clearInterval(intervalStatusCheck);
		};
	}, []);

	const statusProcessed = gitStatusProcess(status)
	const visualProcessed = gitBranchVisualProcess(visual, treeHeight, appWidth)


	return (
		<Box flexDirection="column" minHeight={appheight}>
			{showLogo && <Logo />}
			<Box
				borderStyle={changeBorder} //HERE IS THE CURRENT BORDER TO CHANGE
				borderColor={accentColor}
				className="full-app"
				height={20}
				flexGrow={1}
			>
				<Box
					className="left-box"
					width="50%"
					height="100%"
					flexDirection="column"
					ref={ref}
				// flexGrow={1}
				>
					<Box className="changed-files" height="50%">
						<Box height="100%">
							<Box flexDirection="column" alignItems="flex-start">
								<Text color={accentColor} bold underline>
									Unstaged Changes
								</Text>
									{statusProcessed.unstaged.map(file => <Box alignItems="flex-start" key={file}><Text color={defaultColor}>{file}</Text></Box>)}
							</Box>
						</Box>
					</Box>
					<Text color={accentColor}>
						<Newline />
						<Renderer width={appWidth} />
					</Text>

					<Box className="stage-area" height="50%">
						<Box height="100%">
							<Box flexDirection="column" alignItems="flex-start">
								<Text color={accentColor} bold underline>
									Staged Changes
								</Text>
								{statusProcessed.staged.map(file => <Box alignItems="flex-start" key={file}><Text color={defaultColor}>{file}</Text></Box>)}
							</Box>
						</Box>
					</Box>
				</Box>
				<Box
					className="gitBranch"
					borderStyle={changeBorder} //ALSO HERE
					borderColor={accentColor}
					className="left-box"
					width="65%"
					margin="-1"
					flexDirection="column"
				>
					<Box flexDirection="row">
						<Text color={accentColor} bold underline>
							Git Branch --{">"}
						</Text>
						<Text color={defaultColor}> {branch}</Text>
						<Spacer />
						<Text color={defaultColor}>Newest to Oldest </Text>
					</Box>
					<Box flexDirection="row">
						<Text color={gitTreeColor} bold={changeBold}>
							{visualProcessed.sorted}
						</Text>
						<Text> </Text>
					</Box>
				</Box>
			</Box>
			<Selector defaultColor={defaultColor} accentColor={accentColor} />
			<Newline />
		</Box>
	);
};

module.exports = App;
