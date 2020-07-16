class Firebase{

    constructor(params) {
        window._initFirebase = false;
        // Your web app's Firebase configuration
        this._config = {
            apiKey: "AIzaSyBCi8KpzYF-MWI7rwKUL3B9qPrF9O8cv5Y",
            authDomain: "wharsapp-clone.firebaseapp.com",
            databaseURL: "https://wharsapp-clone.firebaseio.com",
            projectId: "wharsapp-clone",
            storageBucket: "wharsapp-clone.appspot.com",
            messagingSenderId: "855608229717",
            appId: "1:855608229717:web:01bb5e5b5a75c60f5039dc"
        };
        this.init();
        
    }
    init(){
        // Initialize Firebase
        if (!window._initFirebase){
            firebase.initializeApp(this._config);            
            /*firebase.firestore().settings({
                timestampsInSnapshots: true
            });*/
            window._initFirebase = true;
        }       
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }

    initAuth(){
        
        return new Promise((s, f)=>{
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            firebase.auth().signInWithPopup(provider).then(function(result) {
                // This gives you a Google Access Token.
                var token = result.credential;
                // The signed-in user info.
                var user = result.user;
                s({
                    user, 
                    token
                });
            }).catch(err=>{
                f(err);
            });
        });

    }
}