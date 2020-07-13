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

    get timestamp(){
        return this._data.timestamp;
    }
    set timestamp(value){
        this._data.timestamp = value;
    }

    static getRef(){
        return Firebase.db().collection('/chats');
    }

    static find(ownEmail, ctcEmail){
        return Chat.getRef()
                    .where(btoa(ownEmail), '==', true)
                    .where(btoa(ctcEmail), '==', true)
                    .get();
    }

    static create(ownEmail, ctcEmail){
        return new Promise((s, f)=>{
            let users = {};
            users[btoa(ownEmail)] = true;
            users[btoa(ctcEmail)] = true;

            Chat.getRef().add({
                users,
                timestamp: new Date()
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
                if (chats.empty){
                    Chat.create(ownEmail. ctcEmail).then(chat=>{
                        s(chat);
                    });
                }else{
                    chats.forEach(chat => {
                        s(chat)
                    });
                }
            }).catch(err=>{
                f(err);
            });
        });
    }
}