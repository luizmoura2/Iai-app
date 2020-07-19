class Chat extends Model{
    constructor(){
        super();
    }

    get users(){
        return this._data.users;
    }
    set users(value){
        this._data.users = value;
    }

    get timeStamp(){
        return this._data.timeStamp;
    }
    set timeStamp(value){
        this._data.timeStamp = value;
    }

    static getRef(){

        return  Firebase.db().collection('/chats');

    }

    static find(ownEmail, ctcEmail){
      
        return Chat.getRef().where('users.'+ctcEmail, '==', true).where('users.'+ownEmail, '==', true).get();
    }

    static create(ownEmail, ctcEmail){
       
        return new Promise((s, f)=>{
                    
            let usr = {};
            usr[ownEmail] = true;
            usr[ctcEmail] = true;

            Chat.getRef().add({
                users: usr,
                timeStamp: new Date()
            }).then(doc=>{
                Chat.getRef().doc(doc.id).get().then(chat=>{
                    s(chat);
                }).catch(err=>{
                    f(err);
                });
            }).catch(err=>{
                f(err);
            })
        });

    }

    static createIfNotExist(ownEmail, ctcEmail){
        return new Promise((s, f)=>{

            Chat.find(ownEmail, ctcEmail).then(chats=>{
                console.log(chats);
                if (chats.empty){

                    Chat.create(ownEmail, ctcEmail).then(chat=>{
                        s(chat);
                    });
                }else{    
                                   
                    chats.forEach(chat => {
                        s(chat);
                    });
                }
            }).catch(err=>{
                f(err);
            });
        });
    }
}