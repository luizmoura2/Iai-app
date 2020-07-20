/**
 *Class Entity para tratamento de dados de usuários
 * @class User
 * @extends {Model}
 */
class User extends Model{

    constructor(idEmail){
        super();
        if (idEmail){
            this.getByIdEmail(idEmail);
        }


    }
    get name(){
        return this._data.nome;
    }
    set name(value){
        this._data.name = value;
    }

    get email(){
        return this._data.email;
    }
    set email(value){
        this._data.email = value;
    }

    get photo(){
        return this._data.photo;
    }
    set photo(value){
        this._data.photo = value;
    }

    get chatId(){
        return this._data.chatId;
    }
    set chatId(value){
        this._data.chatId = value;
    }

    getByIdEmail(idEmail){

        return new Promise((s, f)=>{

            /*listener*/
            User.findByEmail(idEmail).onSnapshot(doc => {
                this.fromJson(doc.data());
                s(doc);
            });

        });
    }

    save(){
        return User.findByEmail(this.email).set(this.toJson());
    }

    static getRef(){
        return Firebase.db().collection('/users');
    }

    static findByEmail(email){
        return User.getRef().doc(email);
    }

    /**
     * Método para o tratamento de inserção de 
     * um novo usuário
     * @param {*} contact Os dados do usuario a ser inserido
     */
    addContact(contact){
        return User.getRef()
            .doc(this.email)
            .collection('contacts')
            .doc(btoa(contact.email))
            .set(contact.toJson());
    };

    updateContact(userTo, message){
        User.getRef().doc(userTo).collection('contacts').doc(btoa(this.email))
                    .set({
                        lastMessage: message, 
                        lastMessageTime : new Date()
                    },{
                        merge: true
                    });
    }

    getContacts(filter = ''){
        
        return new Promise((s, f)=>{
            User.getRef()
                        .doc(this.email)
                        .collection('contacts')
                        .where('name', '>=', filter)
                        .onSnapshot(docs=>{
                            let ctcs = [];
                            docs.forEach(doc => {
                                let data = doc.data;
                                data.id = doc.id;
                                ctcs.push(data);
                            });
                            this.trigger('ctcschange', docs)
                            s(ctcs);
                        });

        }).catch(err=>{
            f(err);
        });
    };

}