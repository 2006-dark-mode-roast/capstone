"use strict";
const React = require("react");

const { useEffect, useState, useRef } = require("react");
const { Text, Box, measureElement, Newline } = require("ink");
const statusOutput = require("./gitStatusOutput");
const Renderer = require("./components/divider");
const gitBranchCall = require('./currentBranch')
const branchVisual = require('./branchVisual')
const branchVisualText = require('./branchVisualText')

const enterAltScreenCommand = '\x1b[?1049h';
const leaveAltScreenCommand = '\x1b[?1049l';

const exitFullScreen = () => {
	process.stdout.write(leaveAltScreenCommand);
};

const App = () => {
	const [status, setStatus] = useState("");
	const [branch, setBranch] = useState('')
	const [visual, setVisual] = useState('')
	const [text, setText] = useState('')
	const [appWidth, setWidth] = useState(null);

	const ref = useRef(null);

	useEffect(() => {
		setInterval(() => {
			setStatus(statusOutput());
			setBranch(gitBranchCall())
			setVisual(branchVisual())
			setText(branchVisualText())
		}, 1000)
		exitFullScreen()
		process.stdout.write(enterAltScreenCommand)
		const { width, height } = measureElement(ref.current);
		setWidth(width);
	}, []);

	return (
		<Box
			borderStyle="round"
			borderColor="red"
			className="full-app"
			height={20}
			flexGrow={1}
		>
			<Box
				className="left-box"
				width="35%" height='100%'
				flexDirection="column"
				ref={ref}
			// flexGrow={1}
			>
				<Box className="changed-files" height="50%" >
					<Box
						height="100%"
					>
						<Text>
							<Text color="red" bold underline>
								Unstaged Changes
							</Text>
							<Newline />
							{status.unstaged}
						</Text>
					</Box>
				</Box>
				<Text color="red">
					<Newline />
					<Renderer width={appWidth} />
				</Text>

				<Box className="stage-area" height="50%">
					<Box height="100%">
						<Text>
							<Text color="red" bold underline>
								Staged Changes
								</Text>
							<Newline />
							{status.staged}
						</Text>
					</Box>
				</Box>
			</Box>
			<Box
				className="gitBranch"
				borderStyle="round"
				borderColor="red"
				className="left-box"
				width="65%"
				margin="-1"
				flexDirection='column'
			>
				<Box flexDirection='row'>
					<Text color='red' bold underline>Git Branch --{'>'}</Text><Text> {branch}</Text>
				</Box>
				<Text>Newest to Oldest</Text>
				<Box flexDirection='row'>
					<Text color='white' bold>{visual.sorted}</Text><Text>  </Text>
					{/* <Text color='white'>{text.sorted}</Text>  */}
				</Box>
			</Box>
		</Box>
	);
};

module.exports = App;
