'use strict';

import * as React from "react";
import {render} from "react-dom";
import {Editor, EditorState, Modifier, RichUtils, convertToRaw} from "draft-js";
import {stateToHTML} from "draft-js-export-html";
import {stateFromHTML} from 'draft-js-import-html';

class ColorfulEditorExample extends React.Component {
	
	editor;
	state;
	
	constructor(props) {
	  super(props);
	  this.state = {editorState: EditorState.createEmpty()};

	  this.logContentState = this.logContentState.bind(this);
	  this.importContentState = this.importContentState.bind(this);
	  this.focus = this.focus.bind(this);
	  this.onChange = this.onChange.bind(this);
	  this.toggleColor = this.toggleColor.bind(this);
	}
	
	focus() {
		this.editor.focus();
	}
	
	onChange(editorState) {
		this.setState({editorState});
	}

	logContentState() {
		const currentContent = this.state.editorState.getCurrentContent();
		console.log(currentContent);
		console.log(JSON.stringify(convertToRaw(currentContent)));
		console.log(stateToHTML(currentContent, convertToHtmlOptions));
	}
	
	importContentState() {
		//const text = "<p><span style=\"color: rgba(255, 0, 0, 1.0)\">undv </span><span style=\"color: rgba(255, 127, 0, 1.0)\">oanv </span>wner <span style=\"color: rgba(180, 180, 0, 1.0)\">anaosbni </span><span style=\"color: rgba(0, 180, 0, 1.0)\">aoibnf </span>aqpon <span style=\"color: rgba(0, 0, 255, 1.0)\">namaqwegfv </span><span style=\"color: rgba(75, 0, 130, 1.0)\">nvdiao</span><span style=\"color: rgba(127, 0, 255, 1.0)\"> sdavun </span>wl;nr</p>\r\n<p>asndvaoiunbow awovernoab aowrbndobnf</p>";
		const text = '<p><span style="color: rgba(255, 0, 0, 1.0)">undv </span><span style="color: rgba(255, 127, 0, 1.0)">oanv </span>wner <span style="color: rgba(180, 180, 0, 1.0)">anaosbni </span><span style="color: rgba(0, 180, 0, 1.0)">aoibnf </span>aqpon <span style="color: rgba(0, 0, 255, 1.0)">namaqwegfv </span><span style="color: rgba(75, 0, 130, 1.0)">nvdiao</span><span style="color: rgba(127, 0, 255, 1.0)"> sdavun </span>wl;nr</p><p>asndvaoiunbow awovernoab <span style="color: rgba(0, 0, 255, 1.0)">aow</span><span style="color: rgba(180, 180, 0, 1.0)">rbnd</span><span style="color: rgba(0, 0, 255, 1.0)">obnf</span></p>';
		const currentContent = stateFromHTML(text, convertFromHtmlOptions);
		let nextEditorState = EditorState.push(
		this.state.editorState,
		currentContent,
		'insert-fragment'
	  );
	  this.onChange(nextEditorState);
	}

	toggleColor(toggledColor) {
	  const {editorState} = this.state;
	  const selection = editorState.getSelection();

	  // Let's just allow one color at a time. Turn off all active colors.
	  const nextContentState = Object.keys(colorStyleMap)
		.reduce((contentState, color) => {
		  return Modifier.removeInlineStyle(contentState, selection, color)
		}, editorState.getCurrentContent());

	  let nextEditorState = EditorState.push(
		editorState,
		nextContentState,
		'change-inline-style'
	  );

	  const currentStyle = editorState.getCurrentInlineStyle();

	  // Unset style override for current color.
	  if (selection.isCollapsed()) {
		nextEditorState = currentStyle.reduce((state, color) => {
		  return RichUtils.toggleInlineStyle(state, color);
		}, nextEditorState);
	  }

	  // If the color is being toggled on, apply it.
	  if (!currentStyle.has(toggledColor)) {
		nextEditorState = RichUtils.toggleInlineStyle(
		  nextEditorState,
		  toggledColor
		);
	  }

	  this.onChange(nextEditorState);
	}

	render() {
	  const {editorState} = this.state;
	  return (
		<div style={styles.root}>
		  <ColorControls
			editorState={editorState}
			onToggle={this.toggleColor}
		  />
		  <div style={styles.editor} onClick={this.focus}>
			<Editor
			  customStyleMap={colorStyleMap}
			  editorState={editorState}
			  onChange={this.onChange}
			  placeholder="Write something colorful..."
			  ref={(ref) => this.editor = ref}
			/>
		  </div>
		  <div><button onClick={this.logContentState}>Log Content State</button> <button onClick={this.importContentState}>Import Content State</button></div>
		</div>
	  );
	}
}

class StyleButton extends React.Component {
	
	props;
	
	constructor(props) {
	  super(props);
	  
	  this.onToggle = this.onToggle.bind(this);
	}

	onToggle(e) {
		e.preventDefault();
		this.props.onToggle(this.props.style);
	}
	
	render() {
	  let style;
	  if (this.props.active) {
		style = {...styles.styleButton, ...colorStyleMap[this.props.style]};
	  } else {
		style = styles.styleButton;
	  }

	  return (
		<span style={style} onMouseDown={this.onToggle}>
		  {this.props.label}
		</span>
	  );
	}
}

var COLORS = [
{label: 'Red', style: 'red'},
{label: 'Orange', style: 'orange'},
{label: 'Yellow', style: 'yellow'},
{label: 'Green', style: 'green'},
{label: 'Blue', style: 'blue'},
{label: 'Indigo', style: 'indigo'},
{label: 'Violet', style: 'violet'},
];

const ColorControls = (props) => {
	var currentStyle = props.editorState.getCurrentInlineStyle();
	return (
	  <div style={styles.controls}>
		{COLORS.map(type =>
		  <StyleButton
			active={currentStyle.has(type.style)}
			label={type.label}
			onToggle={props.onToggle}
			style={type.style}
			key={type.style}
		  />
		)}
	  </div>
	);
};

// This object provides the styling information for our custom color
// styles.
const colorStyleMap = {
	red: {
	  color: 'rgba(255, 0, 0, 1.0)',
	},
	orange: {
	  color: 'rgba(255, 127, 0, 1.0)',
	},
	yellow: {
	  color: 'rgba(180, 180, 0, 1.0)',
	},
	green: {
	  color: 'rgba(0, 180, 0, 1.0)',
	},
	blue: {
	  color: 'rgba(0, 0, 255, 1.0)',
	},
	indigo: {
	  color: 'rgba(75, 0, 130, 1.0)',
	},
	violet: {
	  color: 'rgba(127, 0, 255, 1.0)',
	},
};

const convertToHtmlOptions = (function createConvertToHtmlOptions() {
	
	const convertToHtmlStyles = {};

	for (const key of Object.keys(colorStyleMap)) {
		convertToHtmlStyles[key] = {'style': colorStyleMap[key]};
	}

	return {inlineStyles: convertToHtmlStyles};
})();

const convertFromHtmlOptions = (function createConvertFromHtmlOptions() {
	const reverseStyleMap = {};
	
	for (const key of Object.keys(colorStyleMap)) {
		var style = colorStyleMap[key];
		for (const attr of Object.keys(style)) {
			var val = style[attr];
			if (val.startsWith('rgba(') && val.endsWith('1.0)')) {
				val = val.replace('rgba(', 'rgb(').replace(new RegExp(',\\s?1\\.0'), '');
			}
			if (!reverseStyleMap[attr]) {
				reverseStyleMap[attr] = {}; 
			}
			reverseStyleMap[attr][val] = key;
		}
	}
	
	function customInlineFn(element, {Style, Entity}) {
		if (element.tagName === 'SPAN' && element.style && element.style["0"] === "color") {
			const colorValue = element.style["color"];
			const styleKey = reverseStyleMap["color"][colorValue];
			return Style(styleKey);
		}
	};
	
	return { customInlineFn: customInlineFn };
})();

const styles = {
	root: {
	  fontFamily: '\'Georgia\', serif',
	  fontSize: 14,
	  padding: 20,
	  width: 600,
	},
	editor: {
	  borderTop: '1px solid #ddd',
	  cursor: 'text',
	  fontSize: 16,
	  marginTop: 20,
	  minHeight: 400,
	  paddingTop: 20,
	},
	controls: {
	  fontFamily: '\'Helvetica\', sans-serif',
	  fontSize: 14,
	  marginBottom: 10,
	  userSelect: 'none',
	},
	styleButton: {
	  color: '#999',
	  cursor: 'pointer',
	  marginRight: 16,
	  padding: '2px 0',
	},
};

render(
	<ColorfulEditorExample />,
	document.getElementById('root')
);