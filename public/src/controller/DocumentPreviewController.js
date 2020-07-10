class DocumentPreviewController{

    constructor(file){
        this._file = file;
    }

    getPreviewData(){

        return new Promise((s, f)=>{
            let reader = new FileReader();
            switch (this._file.type){
                case 'image/jpeg':
                case 'image/jpg':
                case 'image/png':
                case 'image/gif':
                   
                        reader.onload = e=>{
                            s({
                                src: reader.result,
                                name: this._file.name,
                                type: 'image'
                            });
                        };
                        reader.onerror = err=>{
                            f(err);
                        };
                        reader.readAsDataURL(this._file);
                break;
                case 'application/pdf':
                        reader.onload = e=>{
                        //====================================================
                        '//mozilla.github.io/pdf.js/build/pdf.worker.js';
                        pdfjsLib.getDocument(new Uint8Array(reader.result)).promise.then(function(pdf) {
                            
                            // Fetch the first page
                            
                            pdf.getPage(1).then(function(page) {
                                
                              let scale = 1.5;
                              let viewport = page.getViewport({ scale: scale, });
                        
                              //
                              // Prepare canvas using PDF page dimensions
                              //
                              var canvas = document.createElement('canvas');
                              var context = canvas.getContext('2d');
                              canvas.height = viewport.height;
                              canvas.width = viewport.width;
                        
                              //
                              // Render PDF page into canvas context
                              //
                              var renderContext = {
                                canvasContext: context,
                                viewport: viewport,
                              };
                                page.render(renderContext).promise.then(()=>{
                                    let npg = (pdf.numPages>1)? 's':'';
                                    s({
                                        src: canvas.toDataURL('image/png'),
                                        name: `${pdf.numPages} pagina${npg}`,
                                        type: 'image'
                                    });
                                }).catch(err=>{
                                    f(err);
                                });
                            }).catch(err=>{
                                f(err);
                            });
                          }).catch(err=>{
                              f(err);
                          });
                        //===================================================
                    };
                    reader.onerror = err=>{
                        f(err);
                    };
                    reader.readAsArrayBuffer(this._file);
                    /*s({
                        ico: 'jcxhw icon-doc-pdf',
                        name: this._file.name,
                        type: 'pdf'
                    });*/
                break;
                case 'application/vnd.ms-excel':
                case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                      //
                    s({
                        ico: 'jcxhw icon-doc-xls',
                        name: this._file.name,
                        type: 'default'
                    });
                    break;
                case 'application/vnd.ms-powerpoint':
                case 'application/vnd.openxmlformats-officedocument.presentationml.presenteation':
                    s({
                        ico: 'jcxhw icon-doc-ppt',
                        name: this._file.name,
                        type: 'default'
                    });
                               
                    break;
                case 'application/msword':
                case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                    s({
                        ico: 'jcxhw icon-doc-doc',
                        name: this._file.name,
                        type: 'default'
                    });
                    break;
                default:
                    s({
                        ico: 'jcxhw icon-doc-generic',
                        name: this._file.name,
                        type: 'default'
                    });

            }
        });
    }
    
}