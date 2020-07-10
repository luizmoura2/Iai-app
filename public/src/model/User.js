
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

    getByIdEmail(idEmail){

        return new Promise((s, f)=>{

            /*listener*/
            User.findByEmail(idEmail).onSnapshot(doc => {
                this.fromJson(doc.data());
                s(doc);
            });

            /*
            // Statico
            User.findByEmail(idEmail).get().then(doc => {
                this.fromJson(doc.data());
                s(doc);
            }).catch(err=>{
                f(err);
            });*/
        });
    }

    save(){
        return User.findByEmail(this.email).set(this.toJson());
    }

    static getRef(){
        return Firebase.db().collection('users');
    }

    static findByEmail(email){
        return User.getRef().doc(email);
    }

}