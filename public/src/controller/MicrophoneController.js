class MicrophoneController extends ClassEvent{

    constructor() {
        super();
        this._mimeType = 'audio/webm';
        this.isAvailable = false;
        navigator.mediaDevices.getUserMedia({
            audio: true, 
            video: false
        }).then(stream=>{  
            this.isAvailable = true;
            this._stream = stream;          
            //let audio = new Audio();
            /*audio.srcObject = stream; //URL.createObjectURL(stream);
            audio.play();*/
            this.trigger('ready', this._stream);
        }).catch(err=>{
            console.log(err);
        });
        
    }

    /**
     * Encerra a captura do audio
     */
    stop(){
        this._stream.getTracks().forEach(track => {
            track.stop();
        });
    }

    startRecord(){
        if (this.isAvailable){
            this._mediaRecorder =  new MediaRecorder(this._stream, {
                mimeType: this._mimeType
            });
            this._recordedChunks = [];
            this._mediaRecorder.addEventListener('dataavailable', e=>{
                if (e.data.size > 0){
                    this._recordedChunks.push(e.data);

                }
            });

            this._mediaRecorder.addEventListener('stop', e=>{

                let blob = new Blob(this._recordedChunks, {type: this._mimeType});
                let fileName = `rec_${Date.now()}.webm`;

                let audioContext = new AudioContext();

                let reader = new FileReader();
                reader.onload = e=>{
        
                    audioContext.decodeAudioData(reader.result).then(decode=>{

                        let file = new File([blob], fileName, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        });

                        this.trigger('recorded', file, decode);
                    });

                };
                reader.readAsArrayBuffer(blob);                
            });
            
            this._mediaRecorder.start();
            this.startTimer();
        }
    }

    stopRecord(){
        if (this.isAvailable){
            this._mediaRecorder.stop();
            this.stop();
            this.stopTimer();
            
        }

    }

    startTimer(){
        let start = Date.now();
        this._recordMicrofoneInterval = setInterval(()=>{
            this.trigger('recordtime', Date.now() - start);
        }, 1000);
    }

    stopTimer(){
        clearInterval(this._recordMicrofoneInterval);
    }
    

}