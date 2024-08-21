export class Note {
    msg: string;
    id: string;
    type: 'message'|'init';
    constructor(msg: string, id: string, type: 'message'|'init') {
        this.msg = msg;
        this.id = id;
        this.type = type;
    }
}