const React = require("react");
const { useEffect, useState, useRef } = require("react");
const { Text, Box, Newline } = require("ink");
const SelectInput = require("ink-select-input-horizontal").default;
const { execSync, exec } = require("child_process");
const importJsx = require("import-jsx");
const TreeTab = importJsx('./TreeTab')
const Stash = importJsx('./Stash')
const MergeRevert = importJsx('./MergeRevert')

const popStash = require('../actions/undoStash')

//Creates the switch case for the 'Other' Tab.

const dropDown = ({ refreshTab, accentColor, defaultColor }) => {
    const [currentDrop, setCurrentDrop] = useState('')

    const handleSelect = (item) => {
        setCurrentDrop(item.value)
        if(item.value === 'undoStash') {
            popStash()
        }
    }
    const items = [
        {
            label: 'Access Full Log Tree',
            value: 'fullLogTree'
        },
        {
            label: 'Stash Changes',
            value: 'stashChanges'
        },
        {
            label: 'Undo Stash',
            value: 'undoStash'
        },
        {
            label: 'Undo Merge',
            value: 'undoMerge'
        }
    ]
    switch (currentDrop) {
        case 'fullLogTree':
            return (
                <Box flexDirection='column'>
                    <SelectInput items={items} isFocused={false} displayDirection='column' defaultColor={defaultColor} accentColor={accentColor}/>
                    <TreeTab refreshTab={refreshTab} />
                </Box>
            )
        case 'stashChanges':
            return (
                <Box flexDirection='column'>
                    <SelectInput items={items} isFocused={false} displayDirection='column' defaultColor={defaultColor} accentColor={accentColor}/>
                    <Stash refreshTab={refreshTab} />
                </Box>
            )
        case 'undoStash': 
            return (
                <Box flexDirection='column'>
                    <SelectInput items={items} isFocused={false} displayDirection='column' defaultColor={defaultColor} accentColor={accentColor}/>
                    <popStash refreshTab={refreshTab} />
                </Box>
            )
        case 'undoMerge':
            return (
                <Box flexDirection='column'>
                    <SelectInput items={items} isFocused={false} displayDirection='column' defaultColor={defaultColor} accentColor={accentColor}/>
                    <MergeRevert refreshTab={refreshTab} />
                </Box>
            )
        default:
            return (
                // Replace "marginLeft='109'" for optimized solution later down the line.
                <Box flexDirection="column" marginLeft='109' >
                    <SelectInput items={items} onSelect={handleSelect} displayDirection='column' defaultColor={defaultColor} accentColor={accentColor}/>
                    <Newline />
                    <Text color='gray'>Press ESC to go back</Text>
                </Box>
            )
    }
};

module.exports = dropDown
