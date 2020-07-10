class WhatsAppController{

    constructor(){

        this._firebase = new Firebase();
        this.initAuth();
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        

    }
    
    initAuth(){
        this._firebase.initAuth().then(response=>{
            
            this._user = new User(response.user.email);

            this._user.on('datachange', data=>{
                
                this.el.inputNamePanelEditProfile.innerHTML = data.name;
                document.querySelector('title').innerHTML = `${data.name} WhatsApp Clone`;
                if (data.photo){
                    let photo = this.el.imgPanelEditProfile;
                        photo.src = data.photo;
                        photo.show();
                    let photo2 = this.el.myPhoto.querySelector('img');                    
                        photo2.src = data.photo;
                        photo2.show();
                   
                    this.el.imgDefaultPanelEditProfile.hide();
                }
                this.el.appContent.css({display: 'flex'});
            });
           
            this._user.name = response.user.displayName;
            this._user.email = response.user.email;
            this._user.photo = response.user.photoURL;

            this._user.save().then(()=>{
                console.log('Salvo');
            }).catch(err=>{
                console.log(err);
            });
            
        }).catch(e=>{
            console.log(e);
        });
    }

    loadElements(){
        this.el = {};
        document.querySelectorAll('[id]').forEach(element=>{
            this.el[Format.getCamelCase(element.id)] = element;
        });
    }

    elementsPrototype(){

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        };

        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display == 'block') ? 'none': 'block';
            return this;
        }

        Element.prototype.on = function(event, fn){
           event.split(' ').forEach(ev=>{
               this.addEventListener(ev, fn);
           });
           return this;
        }

        Element.prototype.css = function(styles){
            for(let name in styles){
                this.style[name] = styles[name];
            }            
            return this;
        }

        Element.prototype.addClass = function(name){           
            this.classList.add(name); 
            return this;          
        }

        Element.prototype.removeClass = function(name){           
            this.classList.remove(name); 
            return this;          
        }

        Element.prototype.toggleClass = function(name){           
            this.classList.toggle(name); 
            return this;          
        }

        Element.prototype.hasClass = function(name){           
            return this.classList.contains(name);           
        }

        HTMLFormElement.prototype.getForm = function(){
            return new FormData(this);
        };

        HTMLFormElement.prototype.toJson = function(){
            let json = {};
            this.getForm().forEach((value, key)=>{
                json[key] = value;
            });
            return json;
        };

    }/** fim de  elementsPrototype()*/

    initEvents(){

        this.el.myPhoto.on('click', e=>{
            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();
            setTimeout(()=>{
                this.el.panelEditProfile.addClass('open');
            }, 300);            
            
        });

        this.el.btnNewContact.on('click', e=>{
           
            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            setTimeout(()=>{
                this.el.panelAddContact.addClass('open');
            }, 300); 
            
        });

        this.el.btnClosePanelEditProfile.on('click', e=>{
            this.el.panelEditProfile.removeClass('open');
        });

        this.el.btnClosePanelAddContact.on('click', e=>{
            this.el.panelAddContact.removeClass('open');
        });

        this.el.photoContainerEditProfile.on('click', e=>{
            this.el.inputProfilePhoto.click();
        });

        this.el.inputNamePanelEditProfile.on('keypress', e=>{
            if (e.key === 'Enter'){
                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();
            }
        });

                
        this.el.btnSavePanelEditProfile.on('click', e=>{
            
            this.el.btnSavePanelEditProfile.disabled =true;
            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;
            this._user.save().then(()=>{
                console.log('Salvo!');
            }).catch(err=>{
                console.log(err);
            });
            this.el.btnSavePanelEditProfile.disabled = false;
            

        });

        this.el.formPanelAddContact.on('submit', e=>{
            e.preventDefault();
            let formData = new FormData(this.el.formPanelAddContact);
        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{
            item.on('click', e=>{
                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                })
            });
        });

        /**Eventos para a anexar uma foto */
        this.el.btnAttach.on('click', e=>{
            /** Não deixa o evento se propagar alem deste componente */
            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this))
        });

        this.el.btnAttachPhoto.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this.el.inputPhoto.click();
            
        });

        this.el.inputPhoto.on('change', e=>{
            
            [...this.el.inputPhoto.files].forEach(file=>{
                console.log(file);
            });
        });

        /**Eventos para capturar e anexar uma foto */
        this.el.btnAttachCamera.on('click', e=>{
            this.closeAllMainPanel();            
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height':'calc(110% - 120px)'
            })

            this._camera = new CameraController(this.el.videoCamera);
        });

        this.el.btnClosePanelCamera.on('click', e=>{  
            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
        });

        this.el.btnTakePicture.on('click', e=>{
            let dataUrl = this._camera.takeSnapShot();
            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
            //this._camera.stop();
        });

        this.el.btnReshootPanelCamera.on('click', e=>{
            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();
        });

        this.el.btnSendPicture.on('click', e=>{
            console.table('aqui eu');
            console.info('aqui eu');
            console.log(this.el.pictureCamera.src);
            this._camera.stop();
        })

        /** Eventos para anexar contatos */
        this.el.btnAttachContact.on('click', e=>{
            console.log('contact');
            this.el.modalContacts.show();
        });

        this.el.btnCloseModalContacts.on('click', e=>{
            this.el.modalContacts.hide();
        });
        
        /** rotinas para anexar documentos  */
        this.el.btnAttachDocument.on('click', e=>{
            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height':'calc(110% - 120px)'
            })
            this.el.inputDocument.click();
        });

        this.el.inputDocument.on('change', e=>{
            if (this.el.inputDocument.files.length){
                let file = this.el.inputDocument.files[0];
                console.log(file.type);
                this._documentPreviewController = new DocumentPreviewController(file);
                this._documentPreviewController.getPreviewData().then(data=>{
                    switch (data.type){
                        case 'image': 
                            this.el.imgPanelDocumentPreview.src = data.src;
                            this.el.infoPanelDocumentPreview.innerHTML = data.name;
                            this.el.panelDocumentPreview.css({
                                'height':'calc(110% - 120px)'
                            })
                            this.el.imagePanelDocumentPreview.show();
                            this.el.filePanelDocumentPreview.hide();
                            break;
                        case 'pdf':
                            this.el.iconPanelDocumentPreview.className = data.ico;
                            this.el.filenamePanelDocumentPreview.innerHTML = data.name;
                            this.el.imagePanelDocumentPreview.hide();
                            this.el.filePanelDocumentPreview.show();
                            break;
                        default:
                            this.el.iconPanelDocumentPreview.className = data.ico;
                            this.el.filenamePanelDocumentPreview.innerHTML = data.name;
                            this.el.imagePanelDocumentPreview.hide();
                            this.el.filePanelDocumentPreview.show();
                            this.el.panelDocumentPreview.css({
                                'height':'calc(110% - 120px)'
                            })
                            break;
                            
                    }
                }).catch(err=>{
                    console.log(err);
                    
                });
            }
        })

        this.el.btnClosePanelDocumentPreview.on('click', e=>{
            this.el.panelDocumentPreview.removeClass('open');
            this.el.panelMessagesContainer.show();
        });

        this.el.btnSendDocument.on('click', e=>{
            console.log('enviar document');
        });

        /**Eventos par a manipulação da gravação de voz- Microfone */
        this.el.btnSendMicrophone.on('click', e=>{
            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();
            
            this._microphoneController = new MicrophoneController();

            this._microphoneController.on('ready', sound=>{
                console.log('ready');
                this._microphoneController.startRecord();
                
            });

            this._microphoneController.on('recordtime', timer=>{
                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

       

        this.el.btnCancelMicrophone.on('click', e=>{
            console.log('cancel record');
            this._microphoneController.stopRecord();
            this.closeRecordMicrofone();
            
        });

        this.el.btnFinishMicrophone.on('click', e=>{
            console.log('finish record');
            this._microphoneController.stopRecord();
            this.closeRecordMicrofone();
        })
      
        /**Eventos para a caixa de menssagens */
       
        this.el.inputText.on('keypress', e=>{
            if (e.key === 'Enter' && !e.ctrlKey){
                e.preventDefault();
                this.el.btnSend.click();
            }
        });
        this.el.inputText.on('keyup', e=>{
            if (this.el.inputText.innerHTML.length){
                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();
            }else{
                this.el.btnSendMicrophone.show();
                this.el.inputPlaceholder.show();
                this.el.btnSend.hide();
            }
        });

        this.el.btnSend.on('click', e=>{
            console.log(this.el.inputText.innerHTML);
        });

        this.el.btnEmojis.on('click', e=>{
            this.el.panelEmojis.toggleClass('open');
        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{
            emoji.on('click', e=>{
                console.log(emoji.dataset.unicode);
               let img = this.el.imgEmojiDefault.cloneNode();
               img.style.cssText = emoji.style.cssText;
               img.dataset.unicode = emoji.dataset.unicode;
               img.alt = emoji.dataset.unicode;
               emoji.classList.forEach(clazz=>{
                   img.classList.add(clazz)
               });
               //this.el.inputText.appendChild(img);
               let cursor = window.getSelection();
               if (!cursor.focusNode || !cursor.focusNode.id == 'input-text'){
                    this.el.inputText.focus();
                    cursor = window.getSelection();
               }

               let range = document.createRange();
                   range = cursor.getRangeAt(0);
                   range.deleteContents();
               let fragm = document.createDocumentFragment();
                   fragm.appendChild(img);
                   range.insertNode(fragm);
                   range.setStartAfter(img);

               /*{dispatchEvent} força o disparo do evento no componete */
               this.el.inputText.dispatchEvent(new Event('keyup'));
            });
        });


    };/* Fim initEvents */

    closeRecordMicrofone(){
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
    }

    closeAllMainPanel(){
        this.el.panelMessagesContainer.hide();
        this.el.panelCamera.removeClass('open');
        this.el.panelDocumentPreview.removeClass('open');
    }

    closeMenuAttach(){
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }

    closeAllLeftPanel(){
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();
    }
}