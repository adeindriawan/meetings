import React, { Component } from 'react';
import Webcam from 'react-webcam';
import './App.css';
import jsQR from 'jsqr';

class App extends Component {
	
	state = {
		response: '',
		post: '',
		imageBase64: '',
		imageUInt8ClampedAray: '',
		responseToPost: '',
	};

	setRef = webcam => {
		this.webcam = webcam;
	}

	initContext = () => {
		let canvas = document.getElementById("canvas");
		let context = canvas.getContext("2d");
		return context;
	}

	loadImage = (imageSource, context) => {
		let imageObj = new Image();
		imageObj.onload = () => {
			context.drawImage(imageObj, 0, 0);
			let imageData = context.getImageData(0, 0, 350, 350);
			this.readImage(imageData);
		}
		imageObj.src = imageSource;
	}

	readImage = (imageData) => {
		let code = jsQR(imageData.data, 350, 350);
		if (code) {
			alert(code.data);
		} else {
			alert("Failed to decode the QR Code. Please scan the QR Code again.");
		}
	}

	componentDidMount() {
		this.callApi()
			.then(res => this.setState({ response: res.express }))
			.catch(err => console.log(err));
	}
	
	callApi = async () => {
		const response = await fetch('/api/hello');
		const body = await response.json();
		if (response.status !== 200) throw Error(body.message);
		return body;
	};
	
	handleSubmit = async e => {
		e.preventDefault();
		const imageSrc = await this.webcam.getScreenshot();
		let context = await this.initContext();
		await this.loadImage(imageSrc, context);
		const response = await fetch('/api/world', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ post: this.state.post, image: this.state.imageUInt8ClampedAray }),
		});
		const body = await response.text();
    this.setState({ responseToPost: body });
	};

	render() {
		const videoConstraints = {
			facingMode: {exact: "environment"}
		};
		return (
			<div className="App">
				<Webcam audio={false} height={350} ref={this.setRef} videoConstraints={videoConstraints} screenshotFormat="image/jpeg" width={350} />
				
				<p>{this.state.response}</p>
				<form onSubmit={this.handleSubmit}>
				<p>
					<strong>Post to Server:</strong>
				</p>
				<input
					type="text"
					value={this.state.post}
					onChange={e => this.setState({ post: e.target.value })}
				/>
				<button type="submit">Submit</button>
				</form>
				<p>{this.state.responseToPost}</p>
				<canvas id="canvas" width="350" height="350"></canvas>
			</div>
		);
	}
}

export default App;
