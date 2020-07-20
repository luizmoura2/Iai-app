class Upload{

    static send(file, from){
        return new Promise((s, f)=>{

            let uploadTask = Firebase.hd().ref(from)
                    .child(Date.now()+'_'+file.name)
                    .put(file);

            uploadTask.on('state_changed', e=>{
                console.info('upload...');
            }, err =>{
                f(err);
            }, ()=>{
                s(uploadTask.snapshot);
            });
        })
    }
}