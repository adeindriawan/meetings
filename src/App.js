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

	capture = () => {
		const imageSrc = this.webcam.getScreenshot();

		let canvas = document.getElementById("canvas");
		let ctx = canvas.getContext('2d');
		let image = new Image();
		image.onload = () => {
			ctx.drawImage(image, 0, 0);
		}
		image.src = imageSrc;
		let scanImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		this.setState({imageBase64: imageSrc});

		const code = jsQR(scanImageData.data, 350, 350);
		if (code) {
			alert(code);
			console.log(code);
		} else {
			alert('No');
			console.log('Not found');
			console.log(scanImageData.data);
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
    await this.capture();
    console.log(this.state.post);
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
