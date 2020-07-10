class ClassEvent{
    constructor(params) {
        this._events = {};
        
    }

    /**
     * Atribui um evento de nome: eventName no primeiro parametro
     *  com a função fn no segundo parametro
     * @param {*} eventName 
     * @param {*} fn 
     */
    on(eventName, fn){

        if(!this._events[eventName] ){
            this._events[eventName] = new Array();
        }

        this._events[eventName].push(fn);
    }
    /**
     * Dispara o evento passdo no primeiro parâmetro
     * @params ...arguments
     */
    trigger(){

        let args = [...arguments];
        let eventName = args.shift();
        args.push(new Event(eventName));

        if (this._events[eventName] instanceof Array){
            this._events[eventName].forEach(fn => {
                fn.apply(null, args); //executa a função fn
            });
        }

    }

}