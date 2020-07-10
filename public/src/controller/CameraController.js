class CameraController{
    
    constructor(videoEl){

        this._videoEl = videoEl;

        this._videoEl.setAttribute('autoplay', '');
	    this._videoEl.setAttribute('muted', '');
	    this._videoEl.setAttribute('playsinline', '');
	    
        navigator.mediaDevices.getUserMedia({
            audio: false, 
            video: {
                facingMode: 'user'
            }
        }).then(stream=>{
            this._tracks = stream.getTracks();
            this._videoEl.srcObject = stream;
            this._videoEl.play();
        }).catch(err=>{
            console.log(err);
        });
    }
    /**
     * Encerra a captura da webcam
     */
    stop(){
        this._tracks.forEach(track => {
            track.stop();
        });
    }

    takeSnapShot(mimeType = 'image/jpeg'){
              
        //Criando um canvas que vai guardar a imagem temporariamente
        let canvas = document.createElement('canvas');
        canvas.width = this._videoEl.videoWidth;
        canvas.height = this._videoEl.videoHeight;
        let ctx = canvas.getContext('2d');
        
        //Desenhando e convertendo as dimensões
        ctx.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);
        
        //Criando o JPG
        let dataURI = canvas.toDataURL(mimeType); //O resultado é um BASE64 de uma imagem.
        
        return dataURI;
       
    }
}